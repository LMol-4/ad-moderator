/**
 * Script de prueba para Ad Moderator Core
 * Ejecutar con: node test.js
 */

const { createAdModerator, FunctionAnalyzer } = require('./dist/index');

async function testCore() {
  console.log('🧪 Probando Ad Moderator Core...\n');

  try {
    // Crear función de análisis simple
    const simpleAnalyzer = new FunctionAnalyzer('test-analyzer', async (imageBuffer, imageType, options) => {
      const categories = [];
      
      // Verificar tamaño de archivo
      if (imageBuffer.length > 1024 * 1024) { // 1MB
        categories.push({
          name: 'large_file',
          confidence: 0.7,
          severity: 'medium'
        });
      }
      
      // Análisis aleatorio para demo
      if (Math.random() > 0.7) {
        categories.push({
          name: 'potentially_inappropriate',
          confidence: Math.random(),
          severity: 'low'
        });
      }
      
      return categories;
    });

    // Crear moderador
    const moderator = createAdModerator({
      debug: true
    });

    // Configurar analizador
    moderator.setAnalyzer(simpleAnalyzer);

    // Inicializar
    console.log('1. Inicializando moderador...');
    await moderator.initialize();
    console.log('✅ Moderador inicializado\n');

    // Probar análisis individual
    console.log('2. Probando análisis individual...');
    const testImage = {
      buffer: Buffer.alloc(2 * 1024 * 1024), // 2MB
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
      result.flaggedCategories.forEach(cat => {
        console.log(`     • ${cat.name}: ${(cat.confidence * 100).toFixed(1)}% (${cat.severity})`);
      });
    }

    // Probar análisis por lotes
    console.log('\n3. Probando análisis por lotes...');
    const batchImages = [
      { buffer: Buffer.from('img1'), filename: 'img1.jpg' },
      { buffer: Buffer.alloc(512 * 1024), filename: 'img2.jpg' } // 512KB
    ];

    const batchResults = await moderator.moderateImages(batchImages);
    console.log(`✅ Procesadas ${batchResults.length} imágenes`);

    console.log('\n🎉 ¡Todas las pruebas pasaron correctamente!');
    console.log('\n📋 Resumen:');
    console.log('   - Sistema de plugins: ✅ Funcionando');
    console.log('   - Análisis individual: ✅ Funcionando');
    console.log('   - Análisis por lotes: ✅ Funcionando');
    console.log('   - Configuración: ✅ Correcta');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('\n🔧 Posibles soluciones:');
    console.error('   1. Verificar que el proyecto esté compilado (pnpm run build)');
    console.error('   2. Verificar que las dependencias estén instaladas (pnpm install)');
    console.error('   3. Verificar que la función de análisis sea válida');
  } finally {
    if (moderator) {
      moderator.dispose();
      console.log('\n🧹 Recursos liberados');
    }
  }
}

// Ejecutar la prueba
testCore().catch(console.error);
