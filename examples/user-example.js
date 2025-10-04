/**
 * Ejemplo de uso para usuarios finales
 * Este archivo muestra cómo usar la librería sin acceso al código interno
 * 
 * Los usuarios solo pueden:
 * 1. Usar las funciones públicas
 * 2. Ver la documentación de tipos
 * 3. NO pueden ver el código interno de las funciones
 */

const { createAdModerator, FunctionAnalyzer } = require('../packages/core/dist-obfuscated/index');

async function userExample() {
  console.log('👤 Ejemplo de uso para usuarios finales\n');
  console.log('📖 Los usuarios pueden ver:');
  console.log('   ✅ Documentación de la API');
  console.log('   ✅ Tipos de TypeScript');
  console.log('   ✅ Ejemplos de uso');
  console.log('   ❌ Código interno de las funciones\n');

  // Crear función de análisis personalizada
  // Los usuarios pueden crear sus propias funciones de análisis
  async function myCustomAnalysis(imageBuffer, imageType, options) {
    console.log('🔍 Mi función de análisis personalizada');
    console.log(`   - Tamaño de imagen: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
    console.log(`   - Tipo: ${imageType}`);
    
    const categories = [];
    
    // Lógica de análisis personalizada
    if (imageBuffer.length > 1024 * 1024) { // 1MB
      categories.push({
        name: 'large_file',
        confidence: 0.8,
        severity: 'medium'
      });
    }
    
    return categories;
  }

  try {
    // Crear moderador (código interno ofuscado)
    const moderator = createAdModerator({
      debug: true
    });

    // Configurar analizador personalizado
    const analyzer = new FunctionAnalyzer('my-analyzer', myCustomAnalysis);
    moderator.setAnalyzer(analyzer);

    // Inicializar
    console.log('1. Inicializando moderador...');
    await moderator.initialize();
    console.log('✅ Moderador inicializado\n');

    // Analizar imagen
    console.log('2. Analizando imagen...');
    const testImage = {
      buffer: Buffer.alloc(2 * 1024 * 1024), // 2MB
      filename: 'test.jpg',
      mimeType: 'image/jpeg'
    };

    const result = await moderator.moderateImage(testImage);
    
    console.log('✅ Resultado del análisis:');
    console.log(`   - Segura para anuncios: ${result.isSafe ? 'SÍ' : 'NO'}`);
    console.log(`   - Confianza: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   - Tiempo de procesamiento: ${result.metadata.processingTime}ms`);
    console.log(`   - Categorías detectadas: ${result.flaggedCategories.length}`);

    if (result.flaggedCategories.length > 0) {
      console.log('   - Detalles:');
      result.flaggedCategories.forEach(cat => {
        console.log(`     • ${cat.name}: ${(cat.confidence * 100).toFixed(1)}% (${cat.severity})`);
      });
    }

    // Análisis por lotes
    console.log('\n3. Análisis por lotes...');
    const batchImages = [
      { buffer: Buffer.alloc(512 * 1024), filename: 'img1.jpg', mimeType: 'image/jpeg' },
      { buffer: Buffer.alloc(3 * 1024 * 1024), filename: 'img2.jpg', mimeType: 'image/jpeg' }
    ];

    const batchResults = await moderator.moderateImages(batchImages);
    console.log(`✅ Procesadas ${batchResults.length} imágenes`);

    batchResults.forEach((result, index) => {
      console.log(`   Imagen ${index + 1}: ${result.isSafe ? 'Segura' : 'No segura'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (moderator) {
      moderator.dispose();
      console.log('\n🧹 Recursos liberados');
    }
  }
}

// Mostrar información sobre la librería
console.log('📦 Ad Moderator Library');
console.log('   Versión: 1.0.0');
console.log('   Licencia: MIT');
console.log('   Código interno: OFUSCADO (no visible)\n');

// Ejecutar ejemplo
userExample().catch(console.error);
