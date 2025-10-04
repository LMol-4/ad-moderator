#!/bin/bash

# Script para desplegar todo el monorepo
# Uso: ./scripts/deploy-all.sh [--npm] [--firebase]

set -e

echo "🚀 Desplegando Ad Moderator Monorepo..."

# Verificar argumentos
DEPLOY_NPM=false
DEPLOY_FIREBASE=false

for arg in "$@"; do
    case $arg in
        --npm)
        DEPLOY_NPM=true
        shift
        ;;
        --firebase)
        DEPLOY_FIREBASE=true
        shift
        ;;
        --all)
        DEPLOY_NPM=true
        DEPLOY_FIREBASE=true
        shift
        ;;
    esac
done

# Si no se especificó nada, preguntar
if [ "$DEPLOY_NPM" = false ] && [ "$DEPLOY_FIREBASE" = false ]; then
    echo "¿Qué quieres desplegar?"
    echo "1) Solo NPM package"
    echo "2) Solo Firebase Functions"
    echo "3) Ambos"
    read -p "Selecciona una opción (1-3): " choice
    
    case $choice in
        1) DEPLOY_NPM=true ;;
        2) DEPLOY_FIREBASE=true ;;
        3) DEPLOY_NPM=true; DEPLOY_FIREBASE=true ;;
        *) echo "❌ Opción inválida"; exit 1 ;;
    esac
fi

# Compilar todo
echo "🔨 Compilando todos los packages..."
pnpm run build

# Desplegar NPM package
if [ "$DEPLOY_NPM" = true ]; then
    echo "📦 Desplegando en NPM..."
    
    # Verificar que estemos logueados en NPM
    if ! npm whoami &> /dev/null; then
        echo "❌ Error: No estás logueado en NPM. Ejecuta: npm login"
        exit 1
    fi
    
    # Publicar
    pnpm run publish:core
    
    echo "✅ NPM package desplegado exitosamente!"
    echo "🔗 URL: https://www.npmjs.com/package/ad-moderator"
fi

# Desplegar Firebase Functions
if [ "$DEPLOY_FIREBASE" = true ]; then
    echo "🔥 Desplegando Firebase Functions..."
    
    # Verificar que Firebase CLI esté instalado
    if ! command -v firebase &> /dev/null; then
        echo "❌ Error: Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
        exit 1
    fi
    
    # Verificar que estemos logueados en Firebase
    if ! firebase projects:list &> /dev/null; then
        echo "❌ Error: No estás logueado en Firebase. Ejecuta: firebase login"
        exit 1
    fi
    
    # Desplegar
    pnpm run deploy:functions
    
    echo "✅ Firebase Functions desplegadas exitosamente!"
    echo "🔗 URL: https://console.firebase.google.com/"
fi

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📋 Resumen:"
if [ "$DEPLOY_NPM" = true ]; then
    echo "✅ NPM package: https://www.npmjs.com/package/ad-moderator"
fi
if [ "$DEPLOY_FIREBASE" = true ]; then
    echo "✅ Firebase Functions: https://console.firebase.google.com/"
fi
echo ""
echo "📚 Documentación: ./README.md"
echo "🔧 Ejemplos: ./examples/"
