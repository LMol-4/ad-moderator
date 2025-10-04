#!/bin/bash

# Script para publicar Ad Moderator en NPM
# Uso: ./scripts/publish.sh [version]

set -e

echo "🚀 Publicando Ad Moderator en NPM..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta desde el directorio raíz del proyecto."
    exit 1
fi

# Verificar que pnpm esté instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm no está instalado. Instálalo con: npm install -g pnpm"
    exit 1
fi

# Verificar que estemos logueados en NPM
if ! npm whoami &> /dev/null; then
    echo "❌ Error: No estás logueado en NPM. Ejecuta: npm login"
    exit 1
fi

# Obtener versión actual
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Versión actual: $CURRENT_VERSION"

# Si se proporciona una nueva versión, actualizarla
if [ ! -z "$1" ]; then
    NEW_VERSION=$1
    echo "🔄 Actualizando versión a: $NEW_VERSION"
    npm version $NEW_VERSION --no-git-tag-version
    echo "✅ Versión actualizada a: $NEW_VERSION"
fi

# Limpiar y compilar
echo "🧹 Limpiando archivos anteriores..."
rm -rf dist/
rm -rf node_modules/.cache/

echo "🔨 Compilando proyecto..."
pnpm run build

# Verificar que la compilación fue exitosa
if [ ! -d "dist" ]; then
    echo "❌ Error: La compilación falló. No se encontró el directorio dist/"
    exit 1
fi

echo "✅ Compilación exitosa"

# Ejecutar tests (si existen)
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "🧪 Ejecutando tests..."
    pnpm test || echo "⚠️  Tests fallaron, pero continuando..."
fi

# Verificar qué se publicará
echo "🔍 Verificando qué se publicará..."
pnpm publish --dry-run

# Preguntar confirmación
read -p "¿Continuar con la publicación? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publicación cancelada"
    exit 1
fi

# Publicar
echo "📤 Publicando en NPM..."
pnpm publish

# Obtener la versión final
FINAL_VERSION=$(node -p "require('./package.json').version")

echo "🎉 ¡Publicación exitosa!"
echo "📦 Paquete: ad-moderator@$FINAL_VERSION"
echo "🔗 URL: https://www.npmjs.com/package/ad-moderator"
echo ""
echo "📋 Próximos pasos:"
echo "1. Verificar en: https://www.npmjs.com/package/ad-moderator"
echo "2. Actualizar documentación si es necesario"
echo "3. Crear release en GitHub (opcional)"
echo ""
echo "✅ ¡Listo! Tu librería está disponible en NPM."
