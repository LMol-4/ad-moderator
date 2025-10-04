#!/bin/bash

# Script para configurar el monorepo de Ad Moderator
# Uso: ./scripts/setup-monorepo.sh

set -e

echo "🚀 Configurando monorepo de Ad Moderator..."

# Verificar que pnpm esté instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm no está instalado. Instálalo con: npm install -g pnpm"
    exit 1
fi

# Crear directorios necesarios
echo "📁 Creando estructura de directorios..."
mkdir -p packages/core/src
mkdir -p packages/firebase-functions/src
mkdir -p examples
mkdir -p docs
mkdir -p scripts

# Mover archivos existentes al package core
echo "📦 Moviendo archivos al package core..."
if [ -d "src" ]; then
    cp -r src/* packages/core/src/
    echo "✅ Código fuente movido a packages/core/src/"
fi

if [ -f "tsconfig.json" ]; then
    cp tsconfig.json packages/core/
    echo "✅ tsconfig.json copiado a packages/core/"
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Compilar core package
echo "🔨 Compilando core package..."
pnpm run build:core

echo "✅ Monorepo configurado exitosamente!"
echo ""
echo "📋 Estructura creada:"
echo "├── packages/"
echo "│   ├── core/                    # Librería NPM"
echo "│   └── firebase-functions/      # Firebase Functions"
echo "├── examples/                    # Ejemplos de uso"
echo "├── docs/                       # Documentación"
echo "└── scripts/                    # Scripts de utilidad"
echo ""
echo "🚀 Próximos pasos:"
echo "1. pnpm run build:core          # Compilar librería"
echo "2. pnpm run build:functions     # Compilar funciones"
echo "3. pnpm run publish:core        # Publicar en NPM"
echo "4. pnpm run deploy:functions    # Desplegar en Firebase"
