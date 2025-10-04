/**
 * Ejemplo básico de uso de Ad Moderator
 * Ejecutar con: node examples/basic-usage.js
 */

const { createAdModerator, FunctionAnalyzer } = require('../packages/core/dist/index');

async function basicExample() {
  console.log('🚀 Ejemplo básico de Ad Moderator\n');

  // Crear función de análisis simple
  async function simpleAnalysis(imageBuffer, imageType, options) {
    const categories = [];
    
    // Ejemplo: verificar tamaño de archivo
    if (imageBuffer.length > 2 * 1024 * 1024) { // 2MB
      categories.push({
        name: 'large_file',
        confidence: 0.8,
        severity: 'medium'
      });
    }
    
    // Ejemplo: análisis aleatorio para demo
    if (Math.random() > 0.7) {
      categories.push({
        name: 'potentially_inappropriate',
        confidence: Math.random(),
        severity: 'low'
      });
    }
    
    return categories;
  }

  try {
    // Crear moderador
    const moderator = createAdModerator({
      debug: true
    });

    // Configurar analizador
    const analyzer = new FunctionAnalyzer('simple-analyzer', simpleAnalysis);
    moderator.setAnalyzer(analyzer);

    // Inicializar
    console.log('1. Inicializando moderador...');
    await moderator.initialize();
    console.log('✅ Moderador inicializado\n');

    // Probar con imagen
    console.log('2. Analizando imagen...');
    const testImage = {
      buffer: Buffer.alloc(3 * 1024 * 1024), // 3MB
      filename: 'test-image.jpg',
      mimeType: 'image/jpeg'
    };

    const result = await moderator.moderateImage(testImage);
    
    console.log('✅ Análisis completado:');
    console.log(`   - Segura para anuncios: ${result.isSafe ? 'SÍ' : 'NO'}`);
    console.log(`   - Confianza: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   - Tiempo: ${result.metadata.processingTime}ms`);
    console.log(`   - Categorías detectadas: ${result.flaggedCategories.length}`);

    if (result.flaggedCategories.length > 0) {
      console.log('   - Detalles:');
      result.flaggedCategories.forEach(cat => {
        console.log(`     • ${cat.name}: ${(cat.confidence * 100).toFixed(1)}% (${cat.severity})`);
      });
    }

    // Probar análisis por lotes
    console.log('\n3. Análisis por lotes...');
    const batchImages = [
      { buffer: Buffer.from('img1'), filename: 'img1.jpg' },
      { buffer: Buffer.alloc(512 * 1024), filename: 'img2.jpg' } // 512KB
    ];

    const batchResults = await moderator.moderateImages(batchImages);
    console.log(`✅ Procesadas ${batchResults.length} imágenes`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (moderator) {
      moderator.dispose();
      console.log('\n🧹 Recursos liberados');
    }
  }
}

// Ejecutar ejemplo
basicExample().catch(console.error);
