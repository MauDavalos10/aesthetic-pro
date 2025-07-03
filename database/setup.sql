-- =====================================================
-- AESTHETIC PRO - CONFIGURACIÓN DE BASE DE DATOS
-- =====================================================

-- 1. EXTENSIONES NECESARIAS
-- =====================================================

-- Habilitar extensiones para UUID y otras funcionalidades
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLAS PRINCIPALES
-- =====================================================

-- 2.1 TABLA DE PERFILES DE USUARIO
-- Extiende la tabla auth.users con información específica de la aplicación
-- NECESARIA: Sí - Para almacenar datos adicionales del usuario como plan, clínica, etc.

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  clinic_name TEXT,
  plan TEXT DEFAULT 'FREE' CHECK (plan IN ('FREE', 'BASIC', 'PRO')),
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.2 TABLA DE PACIENTES
-- Almacena información de los pacientes de cada usuario
-- NECESARIA: Sí - Core del negocio para gestionar pacientes

CREATE TABLE public.patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER CHECK (age > 0 AND age < 120),
  email TEXT,
  phone TEXT,
  notes TEXT,
  gender TEXT CHECK (gender IN ('M', 'F', 'Other')),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.3 TABLA DE SIMULACIONES
-- Almacena todas las simulaciones realizadas
-- NECESARIA: Sí - Core del producto, almacena el trabajo principal

CREATE TABLE public.simulations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva Simulación',
  procedure_type TEXT NOT NULL CHECK (procedure_type IN ('nose', 'lips', 'both')),
  original_image_url TEXT NOT NULL,
  modified_image_url TEXT,
  thumbnail_url TEXT,
  
  -- Configuraciones de modificación (JSON)
  nose_config JSONB DEFAULT '{}',
  lips_config JSONB DEFAULT '{}',
  
  -- Metadatos de la imagen
  image_metadata JSONB DEFAULT '{}',
  
  -- Estado de la simulación
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  
  -- Notas del procedimiento
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.4 TABLA DE SUSCRIPCIONES
-- Maneja los planes y pagos de los usuarios
-- NECESARIA: Sí - Para monetización y control de límites

CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('FREE', 'BASIC', 'PRO')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2.5 TABLA DE USO MENSUAL
-- Rastrea el uso de simulaciones por mes para aplicar límites
-- NECESARIA: Sí - Para enforcar límites del plan

CREATE TABLE public.monthly_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  simulations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Constraint para evitar duplicados
  UNIQUE(user_id, year, month)
);

-- 2.6 TABLA DE EVENTOS DE AUDITORÍA (OPCIONAL)
-- Rastrea acciones importantes para analytics y debugging
-- NECESARIA: No para MVP - Útil para analytics posteriores

CREATE TABLE public.audit_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. ÍNDICES PARA RENDIMIENTO
-- =====================================================

-- Índices para mejorar consultas frecuentes
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_created_at ON public.patients(created_at DESC);

CREATE INDEX idx_simulations_user_id ON public.simulations(user_id);
CREATE INDEX idx_simulations_patient_id ON public.simulations(patient_id);
CREATE INDEX idx_simulations_created_at ON public.simulations(created_at DESC);
CREATE INDEX idx_simulations_procedure_type ON public.simulations(procedure_type);

CREATE INDEX idx_monthly_usage_user_year_month ON public.monthly_usage(user_id, year, month);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

-- 4. TRIGGERS Y FUNCIONES
-- =====================================================

-- 4.1 Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 4.2 Aplicar trigger a todas las tablas que necesiten updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
  BEFORE UPDATE ON public.patients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simulations_updated_at 
  BEFORE UPDATE ON public.simulations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON public.subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_usage_updated_at 
  BEFORE UPDATE ON public.monthly_usage 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.3 Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.4 Función para incrementar contador de uso mensual
CREATE OR REPLACE FUNCTION public.increment_monthly_usage(user_uuid UUID)
RETURNS void AS $$
DECLARE
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  current_month INTEGER := EXTRACT(MONTH FROM NOW());
BEGIN
  INSERT INTO public.monthly_usage (user_id, year, month, simulations_count)
  VALUES (user_uuid, current_year, current_month, 1)
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET 
    simulations_count = monthly_usage.simulations_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.5 Función para obtener límites del plan
CREATE OR REPLACE FUNCTION public.get_plan_limits(plan_name TEXT)
RETURNS TABLE(simulations_limit INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT CASE 
    WHEN plan_name = 'FREE' THEN 5
    WHEN plan_name = 'BASIC' THEN 50
    WHEN plan_name = 'PRO' THEN 999999
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql;

-- 4.6 Función para verificar si el usuario puede crear una simulación
CREATE OR REPLACE FUNCTION public.can_create_simulation(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  current_usage INTEGER;
  plan_limit INTEGER;
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  current_month INTEGER := EXTRACT(MONTH FROM NOW());
BEGIN
  -- Obtener plan del usuario
  SELECT plan INTO user_plan FROM public.profiles WHERE id = user_uuid;
  
  -- Si es PRO, siempre puede
  IF user_plan = 'PRO' THEN
    RETURN TRUE;
  END IF;
  
  -- Obtener uso actual
  SELECT COALESCE(simulations_count, 0) INTO current_usage
  FROM public.monthly_usage 
  WHERE user_id = user_uuid AND year = current_year AND month = current_month;
  
  -- Obtener límite del plan
  SELECT simulations_limit INTO plan_limit FROM public.get_plan_limits(user_plan);
  
  RETURN current_usage < plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- 5.1 Políticas para PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5.2 Políticas para PATIENTS
CREATE POLICY "Users can view own patients" ON public.patients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patients" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patients" ON public.patients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patients" ON public.patients
  FOR DELETE USING (auth.uid() = user_id);

-- 5.3 Políticas para SIMULATIONS
CREATE POLICY "Users can view own simulations" ON public.simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON public.simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations" ON public.simulations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations" ON public.simulations
  FOR DELETE USING (auth.uid() = user_id);

-- 5.4 Políticas para SUBSCRIPTIONS
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 5.5 Políticas para MONTHLY_USAGE
CREATE POLICY "Users can view own usage" ON public.monthly_usage
  FOR SELECT USING (auth.uid() = user_id);

-- 5.6 Políticas para AUDIT_EVENTS
CREATE POLICY "Users can view own events" ON public.audit_events
  FOR SELECT USING (auth.uid() = user_id);

-- 6. DATOS INICIALES (SEEDS)
-- =====================================================

-- Insertar datos de ejemplo solo si estás en desarrollo
-- COMENTAR ESTAS LÍNEAS EN PRODUCCIÓN

/*
-- Ejemplo de perfil de prueba
INSERT INTO public.profiles (id, email, full_name, clinic_name, plan) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@aestheticpro.com', 'Dr. Demo', 'Clínica Demo', 'BASIC');

-- Ejemplo de paciente de prueba
INSERT INTO public.patients (user_id, name, age, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'María González', 28, 'Interesada en rinoplastia');
*/

-- 7. VISTAS ÚTILES
-- =====================================================

-- Vista para estadísticas del usuario
CREATE VIEW public.user_stats AS
SELECT 
  p.id,
  p.full_name,
  p.clinic_name,
  p.plan,
  COUNT(DISTINCT pat.id) as total_patients,
  COUNT(DISTINCT s.id) as total_simulations,
  COUNT(DISTINCT CASE WHEN s.created_at >= DATE_TRUNC('month', NOW()) THEN s.id END) as simulations_this_month,
  COALESCE(mu.simulations_count, 0) as current_month_usage
FROM public.profiles p
LEFT JOIN public.patients pat ON p.id = pat.user_id
LEFT JOIN public.simulations s ON p.id = s.user_id
LEFT JOIN public.monthly_usage mu ON p.id = mu.user_id 
  AND mu.year = EXTRACT(YEAR FROM NOW()) 
  AND mu.month = EXTRACT(MONTH FROM NOW())
GROUP BY p.id, p.full_name, p.clinic_name, p.plan, mu.simulations_count;

-- =====================================================
-- FIN DEL SETUP DE BASE DE DATOS
-- =====================================================

-- INSTRUCCIONES DE USO:
-- 1. Copia este script completo
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega el script y ejecuta
-- 4. Verifica que todas las tablas se crearon correctamente
-- 5. Configura las variables de entorno en tu aplicación 