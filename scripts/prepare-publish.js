/**
 * Script para preparar la librería para publicación en NPM
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparando Ad Moderator para publicación...\n');

// 1. Verificar que esté compilado
if (!fs.existsSync('dist')) {
  console.log('❌ Error: El proyecto no está compilado');
  console.log('   Ejecuta: pnpm run build');
  process.exit(1);
}

// 2. Verificar archivos esenciales
const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'package.json',
  'README.md'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.log(`❌ Error: Archivo requerido no encontrado: ${file}`);
    process.exit(1);
  }
}

// 3. Verificar que la versión esté actualizada
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`📦 Versión actual: ${packageJson.version}`);

// 4. Crear archivo .npmignore si no existe
const npmignoreContent = `# Source files
src/
examples/
firebase-functions-example/
scripts/
test-claude.js
env.example

# Development files
tsconfig.json
.eslintrc.js
.gitignore

# Build artifacts
*.tsbuildinfo

# Logs
*.log
npm-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port`;

if (!fs.existsSync('.npmignore')) {
  fs.writeFileSync('.npmignore', npmignoreContent);
  console.log('✅ Creado archivo .npmignore');
}

// 5. Verificar que no haya archivos de test en dist
const distFiles = fs.readdirSync('dist');
const testFiles = distFiles.filter(file => file.includes('.test.') || file.includes('.spec.'));
if (testFiles.length > 0) {
  console.log('⚠️  Advertencia: Archivos de test encontrados en dist:', testFiles);
}

console.log('\n✅ Preparación completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. pnpm run build');
console.log('2. pnpm publish --dry-run  # Verificar qué se publicará');
console.log('3. pnpm publish            # Publicar a NPM');
console.log('\n🔗 Tu librería estará disponible en:');
console.log(`   https://www.npmjs.com/package/${packageJson.name}`);
