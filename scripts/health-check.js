#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🏥 AestheticPro Health Check");
console.log("============================\n");

let score = 0;
const maxScore = 20;

// 1. Verificar estructura de directorios
console.log("📁 Estructura de Directorios");
console.log("============================");

const requiredDirs = [
  "pages",
  "components",
  "lib",
  "store",
  "hooks",
  "scripts",
];

const requiredFiles = [
  "package.json",
  "next.config.js",
  ".env.local.example",
  "README.md",
];

requiredDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
    score++;
  } else {
    console.log(`❌ ${dir}/ - Faltante`);
  }
});

console.log("");

// 2. Verificar archivos principales
console.log("📄 Archivos Principales");
console.log("=======================");

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    score++;
  } else {
    console.log(`❌ ${file} - Faltante`);
  }
});

console.log("");

// 3. Verificar páginas
console.log("📚 Páginas");
console.log("==========");

const requiredPages = [
  "pages/index.js",
  "pages/_app.js",
  "pages/dashboard.js",
  "pages/simulator.js",
  "pages/patients.js",
  "pages/settings.js",
];

requiredPages.forEach((page) => {
  if (fs.existsSync(page)) {
    console.log(`✅ ${page}`);
    score++;
  } else {
    console.log(`❌ ${page} - Faltante`);
  }
});

console.log("");

// 4. Verificar componentes
console.log("🧩 Componentes");
console.log("==============");

const requiredComponents = [
  "components/Layout.js",
  "components/SimulationCanvas.js",
];

requiredComponents.forEach((component) => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
    score++;
  } else {
    console.log(`❌ ${component} - Faltante`);
  }
});

console.log("");

// 5. Verificar archivos de configuración
console.log("⚙️  Configuración");
console.log("=================");

const configFiles = [
  "lib/supabase.js",
  "lib/cloudinary.js",
  "lib/utils.js",
  "lib/notifications.js",
  "store/useStore.js",
  "hooks/useSimulation.js",
];

configFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    score++;
  } else {
    console.log(`❌ ${file} - Faltante`);
  }
});

console.log("");

// 6. Verificar variables de entorno
console.log("🌍 Variables de Entorno");
console.log("=======================");

if (fs.existsSync(".env.local")) {
  console.log("✅ .env.local existe");

  try {
    const envContent = fs.readFileSync(".env.local", "utf8");
    const envVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    ];

    envVars.forEach((envVar) => {
      if (envContent.includes(envVar)) {
        console.log(`✅ ${envVar} configurado`);
      } else {
        console.log(`⚠️  ${envVar} no encontrado`);
      }
    });
  } catch (error) {
    console.log("❌ Error leyendo .env.local");
  }
} else {
  console.log("⚠️  .env.local no existe (usar .env.local.example como base)");
}

console.log("");

// 7. Verificar package.json
console.log("📦 Dependencias");
console.log("===============");

try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const requiredDeps = [
    "next",
    "react",
    "@mui/material",
    "@supabase/supabase-js",
    "zustand",
    "fabric",
    "cloudinary",
    "stripe",
    "react-hot-toast",
  ];

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - Faltante`);
    }
  });
} catch (error) {
  console.log("❌ Error leyendo package.json");
}

console.log("");

// Resumen final
console.log("📊 Resumen");
console.log("==========");
const percentage = Math.round((score / maxScore) * 100);
console.log(`Puntuación: ${score}/${maxScore} (${percentage}%)`);

if (percentage >= 90) {
  console.log("🎉 ¡Excelente! El proyecto está bien configurado");
} else if (percentage >= 70) {
  console.log("👍 Bueno. Solo faltan algunos elementos menores");
} else if (percentage >= 50) {
  console.log("⚠️  Regular. Faltan algunos archivos importantes");
} else {
  console.log("❌ Crítico. Faltan muchos archivos esenciales");
}

console.log("");

// Próximos pasos
console.log("🚀 Próximos Pasos");
console.log("==================");
console.log("1. Configurar variables de entorno en .env.local");
console.log("2. npm install - Instalar dependencias");
console.log(
  "3. Configurar servicios (Supabase, Cloudinary, Google OAuth, Stripe)"
);
console.log("4. npm run dev - Iniciar servidor de desarrollo");
console.log("5. Probar funcionalidades básicas");

console.log("");
console.log("📚 Documentación: README.md");
console.log("🔧 Script de desarrollo: npm run dev:setup");
console.log("🏥 Health check: node scripts/health-check.js");

console.log("");
console.log("¡Listo para generar ingresos! 💰");

process.exit(percentage < 50 ? 1 : 0);
