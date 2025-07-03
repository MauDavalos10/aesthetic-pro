-- =====================================================
-- AESTHETIC PRO - SETUP MÍNIMO PARA MVP
-- Solo las tablas esenciales para empezar rápido
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE PERFILES (ESENCIAL)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  clinic_name TEXT,
  plan TEXT DEFAULT 'FREE' CHECK (plan IN ('FREE', 'BASIC', 'PRO')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. TABLA DE PACIENTES (ESENCIAL)
CREATE TABLE public.patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. TABLA DE SIMULACIONES (ESENCIAL)
CREATE TABLE public.simulations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva Simulación',
  procedure_type TEXT NOT NULL CHECK (procedure_type IN ('nose', 'lips', 'both')),
  original_image_url TEXT NOT NULL,
  modified_image_url TEXT,
  nose_config JSONB DEFAULT '{}',
  lips_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. TABLA DE USO MENSUAL (PARA LÍMITES)
CREATE TABLE public.monthly_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  simulations_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, year, month)
);

-- Trigger para crear perfil automáticamente
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para verificar límites
CREATE OR REPLACE FUNCTION public.can_create_simulation(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  current_usage INTEGER := 0;
  current_year INTEGER := EXTRACT(YEAR FROM NOW());
  current_month INTEGER := EXTRACT(MONTH FROM NOW());
BEGIN
  SELECT plan INTO user_plan FROM public.profiles WHERE id = user_uuid;
  
  IF user_plan = 'PRO' THEN RETURN TRUE; END IF;
  
  SELECT COALESCE(simulations_count, 0) INTO current_usage
  FROM public.monthly_usage 
  WHERE user_id = user_uuid AND year = current_year AND month = current_month;
  
  RETURN CASE 
    WHEN user_plan = 'FREE' THEN current_usage < 5
    WHEN user_plan = 'BASIC' THEN current_usage < 50
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas
CREATE POLICY "Users can manage own data" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own patients" ON public.patients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own simulations" ON public.simulations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON public.monthly_usage
  FOR SELECT USING (auth.uid() = user_id);

-- ¡LISTO! Con esto puedes empezar tu MVP 