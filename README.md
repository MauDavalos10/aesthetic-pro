# AestheticPro - Simulador de Procedimientos Estéticos

Una aplicación web profesional para clínicas estéticas que permite simular cambios en nariz y labios utilizando inteligencia artificial y herramientas de edición avanzadas.

## 🚀 Características

- **Simulación de Nariz**: Ajustes de ancho, altura, puente y punta
- **Simulación de Labios**: Control de volumen, ancho, arco de cupido y definición
- **Comparación Antes/Después**: Vista lado a lado para mostrar resultados
- **Gestión de Pacientes**: Base de datos organizada de pacientes y simulaciones
- **Planes de Suscripción**: Freemium con límites configurables
- **Autenticación Google**: Login simple y seguro
- **Interfaz Moderna**: Diseño profesional con Material UI
- **Canvas Interactivo**: Edición en tiempo real con Fabric.js

## 🛠 Stack Tecnológico

### Frontend

- **Next.js 14** - Framework React
- **Material UI** - Biblioteca de componentes
- **Fabric.js** - Manipulación de canvas
- **Zustand** - Gestión de estado
- **React Query** - Gestión de datos y cache

### Backend & Base de Datos

- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos
- **Vercel** - Hosting y deployment

### Servicios Externos

- **Cloudinary** - Almacenamiento y procesamiento de imágenes
- **Stripe** - Sistema de pagos
- **Google OAuth** - Autenticación

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/aesthetic-pro.git
cd aesthetic-pro
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.local.example .env.local
```

## ⚙️ Configuración de Servicios

### Supabase Setup

1. **Crear proyecto en Supabase**

   - Ve a [supabase.com](https://supabase.com)
   - Crea una nueva organización y proyecto
   - Anota la URL y la API Key

2. **Configurar base de datos**

   ```sql
   -- Crear tabla de usuarios
   CREATE TABLE users (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     clinic_name TEXT,
     plan TEXT DEFAULT 'FREE',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
     PRIMARY KEY (id)
   );

   -- Crear tabla de pacientes
   CREATE TABLE patients (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     age INTEGER,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Crear tabla de simulaciones
   CREATE TABLE simulations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     original_image_url TEXT NOT NULL,
     modified_image_url TEXT,
     procedure_type TEXT NOT NULL, -- 'nose' o 'lips'
     modifications JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Habilitar Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
   ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

   -- Políticas de seguridad
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own patients" ON patients FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own patients" ON patients FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own patients" ON patients FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own simulations" ON simulations FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own simulations" ON simulations FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

3. **Configurar autenticación Google**
   - Ve a Authentication > Settings en Supabase
   - Habilita Google provider
   - Configura OAuth redirect URLs:
     - `http://localhost:3000/auth/callback` (desarrollo)
     - `https://tu-dominio.com/auth/callback` (producción)

### Cloudinary Setup

1. **Crear cuenta en Cloudinary**

   - Ve a [cloudinary.com](https://cloudinary.com)
   - Crea una cuenta gratuita

2. **Obtener credenciales**

   - Cloud Name
   - API Key
   - API Secret

3. **Configurar upload presets**
   - Ve a Settings > Upload
   - Crea un preset llamado "aesthetic_images"
   - Configura:
     - Mode: Unsigned
     - Max file size: 10MB
     - Allowed formats: jpg, png
     - Auto-optimize: ON

### Google OAuth Setup

1. **Google Cloud Console**

   - Ve a [console.cloud.google.com](https://console.cloud.google.com)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Habilitar APIs**

   - Google+ API
   - Google OAuth2 API

3. **Crear credenciales OAuth**
   - Ve a Credentials > Create Credentials > OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `https://tu-proyecto.supabase.co/auth/v1/callback`

### Stripe Setup (Opcional)

1. **Crear cuenta en Stripe**

   - Ve a [stripe.com](https://stripe.com)
   - Completa el registro

2. **Obtener API Keys**

   - Publishable key (para frontend)
   - Secret key (para backend)

3. **Configurar productos**
   - Plan Básico: $29/mes
   - Plan Pro: $99/mes

## 🔧 Variables de Entorno

Configura las siguientes variables en `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Stripe (Opcional)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## 🚀 Desarrollo

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
aesthetic-pro/
├── pages/                    # Páginas de Next.js
│   ├── index.js             # Landing page
│   ├── dashboard.js         # Dashboard principal
│   ├── simulator.js         # Simulador principal
│   ├── patients.js          # Gestión de pacientes
│   └── _app.js              # App wrapper
├── components/              # Componentes reutilizables
│   ├── Layout.js            # Layout principal
│   └── SimulationCanvas.js  # Canvas de simulación
├── lib/                     # Utilities y configuraciones
│   └── supabase.js          # Cliente de Supabase
├── store/                   # Estado global
│   └── useStore.js          # Store de Zustand
└── public/                  # Archivos estáticos
```

## 🎨 Funcionalidades Principales

### 1. Simulador

- Carga de imágenes con drag & drop
- Detección automática de puntos faciales (simulada)
- Controles deslizantes para ajustes precisos
- Vista de comparación antes/después
- Descarga de resultados

### 2. Gestión de Pacientes

- Lista organizada de pacientes
- Historial de simulaciones
- Búsqueda y filtros
- Notas y detalles del paciente

### 3. Sistema de Planes

- Plan Gratuito: 5 simulaciones/mes
- Plan Básico: 50 simulaciones/mes ($29)
- Plan Pro: Simulaciones ilimitadas ($99)

## 🔜 Roadmap

### Fase 1 (Actual - MVP)

- ✅ Autenticación con Google
- ✅ Simulador básico
- ✅ Gestión de pacientes
- ✅ Sistema de planes

### Fase 2 (Próximas funcionalidades)

- [ ] Integración real con MediaPipe
- [ ] Mejoras en la simulación
- [ ] Sistema de pagos con Stripe
- [ ] Exportación en HD
- [ ] Notificaciones por email

### Fase 3 (Escalabilidad)

- [ ] API pública
- [ ] Analytics avanzados
- [ ] Branding personalizado
- [ ] Integración con CRM
- [ ] App móvil

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 💼 Contacto

Para consultas sobre licencias comerciales o soporte empresarial:

- Email: contacto@aestheticpro.com
- Website: [aestheticpro.com](https://aestheticpro.com)

## 🙏 Agradecimientos

- [MediaPipe](https://mediapipe.dev/) por la tecnología de detección facial
- [Fabric.js](http://fabricjs.com/) por las herramientas de canvas
- [Material UI](https://mui.com/) por los componentes de interfaz
- [Supabase](https://supabase.com/) por el backend

---

**AestheticPro** - Transformando la consulta estética con tecnología 🚀
# aesthetic-pro
