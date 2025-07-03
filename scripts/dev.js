#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 AestheticPro Development Setup");
console.log("================================\n");

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("⚠️  .env.local no encontrado");
  console.log("📋 Copiando .env.local.example...\n");

  try {
    const envExample = fs.readFileSync(".env.local.example", "utf8");
    fs.writeFileSync(".env.local", envExample);
    console.log("✅ .env.local creado");
    console.log(
      "🔧 Por favor, configura las variables de entorno antes de continuar\n"
    );
  } catch (error) {
    console.error("❌ Error al crear .env.local:", error.message);
    process.exit(1);
  }
} else {
  console.log("✅ .env.local encontrado\n");
}

// Verificar dependencias
console.log("📦 Verificando dependencias...");
try {
  execSync("npm list --depth=0", { stdio: "ignore" });
  console.log("✅ Dependencias instaladas\n");
} catch (error) {
  console.log("📥 Instalando dependencias...");
  try {
    execSync("npm install", { stdio: "inherit" });
    console.log("✅ Dependencias instaladas\n");
  } catch (installError) {
    console.error("❌ Error al instalar dependencias:", installError.message);
    process.exit(1);
  }
}

// Verificar variables de entorno críticas
console.log("🔍 Verificando configuración...");
require("dotenv").config({ path: ".env.local" });

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.log("⚠️  Variables de entorno faltantes:");
  missingVars.forEach((envVar) => {
    console.log(`   - ${envVar}`);
  });
  console.log("\n🔧 Por favor, configura estas variables en .env.local\n");
} else {
  console.log("✅ Variables de entorno configuradas\n");
}

// Información del proyecto
console.log("📱 Información del Proyecto");
console.log("===========================");
console.log("Nombre: AestheticPro - Simulador de Procedimientos Estéticos");
console.log("Framework: Next.js 13");
console.log("UI: Material-UI");
console.log("Estado: Zustand");
console.log("Base de datos: Supabase");
console.log("Almacenamiento: Cloudinary");
console.log("Pagos: Stripe");
console.log("Auth: Google OAuth\n");

console.log("🌐 URLs de Desarrollo");
console.log("====================");
console.log("Local: http://localhost:3000");
console.log("Red: http://192.168.1.x:3000\n");

console.log("📚 Páginas Disponibles");
console.log("======================");
console.log("/ - Landing page");
console.log("/dashboard - Panel principal");
console.log("/simulator - Simulador de procedimientos");
console.log("/patients - Gestión de pacientes");
console.log("/settings - Configuración y planes\n");

console.log("🛠️  Scripts Disponibles");
console.log("=======================");
console.log("npm run dev - Servidor de desarrollo");
console.log("npm run build - Construir para producción");
console.log("npm run start - Servidor de producción");
console.log("npm run lint - Verificar código");
console.log("npm run dev:setup - Este script\n");

// Iniciar servidor de desarrollo
console.log("🚀 Iniciando servidor de desarrollo...\n");

try {
  execSync("npm run dev", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Error al iniciar el servidor:", error.message);
  process.exit(1);
}
