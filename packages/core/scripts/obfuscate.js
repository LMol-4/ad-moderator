/**
 * Script para ofuscar el código JavaScript compilado
 * Esto hace que el código sea ilegible para los usuarios finales
 */

const fs = require('fs');
const path = require('path');

// Función simple de ofuscación básica
function obfuscateCode(code) {
  // Reemplazar nombres de variables y funciones con nombres cortos
  const obfuscated = code
    // Reemplazar nombres de clases
    .replace(/class\s+(\w+)/g, (match, className) => {
      const shortName = 'C' + Math.random().toString(36).substr(2, 3);
      return `class ${shortName}`;
    })
    // Reemplazar nombres de métodos
    .replace(/\.(\w+)\s*\(/g, (match, methodName) => {
      const shortName = 'm' + Math.random().toString(36).substr(2, 2);
      return `.${shortName}(`;
    })
    // Reemplazar nombres de variables
    .replace(/const\s+(\w+)/g, (match, varName) => {
      const shortName = 'v' + Math.random().toString(36).substr(2, 2);
      return `const ${shortName}`;
    })
    .replace(/let\s+(\w+)/g, (match, varName) => {
      const shortName = 'v' + Math.random().toString(36).substr(2, 2);
      return `let ${shortName}`;
    })
    .replace(/var\s+(\w+)/g, (match, varName) => {
      const shortName = 'v' + Math.random().toString(36).substr(2, 2);
      return `var ${shortName}`;
    })
    // Remover espacios extra
    .replace(/\s+/g, ' ')
    // Remover comentarios
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Minificar
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')');

  return obfuscated;
}

// Función para ofuscar archivos
function obfuscateFile(inputPath, outputPath) {
  try {
    console.log(`🔒 Ofuscando: ${inputPath}`);
    
    const code = fs.readFileSync(inputPath, 'utf8');
    const obfuscated = obfuscateCode(code);
    
    // Crear directorio de salida si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, obfuscated);
    console.log(`✅ Ofuscado guardado en: ${outputPath}`);
    
    // Mostrar estadísticas
    const originalSize = Buffer.byteLength(code, 'utf8');
    const obfuscatedSize = Buffer.byteLength(obfuscated, 'utf8');
    const reduction = ((originalSize - obfuscatedSize) / originalSize * 100).toFixed(1);
    
    console.log(`📊 Tamaño original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`📊 Tamaño ofuscado: ${(obfuscatedSize / 1024).toFixed(1)} KB`);
    console.log(`📊 Reducción: ${reduction}%`);
    
  } catch (error) {
    console.error(`❌ Error ofuscando ${inputPath}:`, error.message);
  }
}

// Función principal
function main() {
  console.log('🚀 Iniciando ofuscación del código...\n');
  
  const distDir = path.join(__dirname, '../dist');
  const obfuscatedDir = path.join(__dirname, '../dist-obfuscated');
  
  // Crear directorio de salida
  if (!fs.existsSync(obfuscatedDir)) {
    fs.mkdirSync(obfuscatedDir, { recursive: true });
  }
  
  // Buscar archivos JavaScript en dist
  const files = fs.readdirSync(distDir, { recursive: true })
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(distDir, file));
  
  if (files.length === 0) {
    console.log('⚠️  No se encontraron archivos JavaScript en dist/');
    console.log('   Ejecuta primero: npm run build');
    return;
  }
  
  // Ofuscar cada archivo
  files.forEach(file => {
    const relativePath = path.relative(distDir, file);
    const outputPath = path.join(obfuscatedDir, relativePath);
    obfuscateFile(file, outputPath);
  });
  
  // Copiar archivos de tipos (.d.ts) sin ofuscar
  const typeFiles = fs.readdirSync(distDir, { recursive: true })
    .filter(file => file.endsWith('.d.ts'))
    .map(file => path.join(distDir, file));
  
  typeFiles.forEach(file => {
    const relativePath = path.relative(distDir, file);
    const outputPath = path.join(obfuscatedDir, relativePath);
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.copyFileSync(file, outputPath);
    console.log(`📋 Copiado archivo de tipos: ${relativePath}`);
  });
  
  console.log('\n✅ Ofuscación completada!');
  console.log(`📁 Código ofuscado guardado en: ${obfuscatedDir}`);
  console.log('\n💡 Para publicar, usa: npm run publish:obfuscated');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { obfuscateCode, obfuscateFile };
