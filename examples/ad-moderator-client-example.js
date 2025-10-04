/**
 * Ejemplo de uso con AdModeratorClient
 * 
 * Este ejemplo muestra cómo usar la nueva API simplificada:
 * import { AdModeratorClient } from 'ad-moderator';
 */

const { AdModeratorClient, createAdModeratorClient } = require('../packages/core/dist-obfuscated/index');

async function clientExample() {
  console.log('🚀 Ejemplo con AdModeratorClient\n');

  // Crear función de análisis personalizada
  async function myImageAnalysis(imageBuffer, imageType, options) {
    console.log('🔍 Analizando imagen con mi función personalizada...');
    console.log(`   - Tamaño: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
    console.log(`   - Tipo: ${imageType}`);
    
    const categories = [];
    
    // Tu lógica de análisis aquí
    if (imageBuffer.length > 2 * 1024 * 1024) { // 2MB
      categories.push({
        name: 'large_file',
        confidence: 0.8,
        severity: 'medium',
        reason: 'Archivo muy grande para anuncios'
      });
    }
    
    // Simular análisis de contenido
    if (Math.random() > 0.6) {
      categories.push({
        name: 'content_review_needed',
        confidence: Math.random(),
        severity: 'low',
        reason: 'Requiere revisión manual de contenido'
      });
    }
    
    return categories;
  }

  try {
    // Método 1: Crear cliente directamente
    console.log('1. Creando cliente directamente...');
    const client = new AdModeratorClient({
      debug: true
    });

    // Configurar función de análisis
    client.setAnalysisFunction(myImageAnalysis);

    // Inicializar
    await client.initialize();
    console.log('✅ Cliente inicializado\n');

    // Analizar imagen
    console.log('2. Analizando imagen...');
    const testImage = {
      buffer: Buffer.alloc(3 * 1024 * 1024), // 3MB
      filename: 'advertisement.jpg',
      mimeType: 'image/jpeg'
    };

    const result = await client.moderateImage(testImage);
    
    console.log('✅ Resultado:');
    console.log(`   - Segura para anuncios: ${result.isSafe ? 'SÍ' : 'NO'}`);
    console.log(`   - Confianza: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   - Tiempo: ${result.metadata.processingTime}ms`);

    if (result.flaggedCategories.length > 0) {
      console.log('   - Categorías detectadas:');
      result.flaggedCategories.forEach(cat => {
        console.log(`     • ${cat.name}: ${(cat.confidence * 100).toFixed(1)}% (${cat.severity})`);
        console.log(`       Razón: ${cat.reason}`);
      });
    }

    // Verificar si es segura (método simplificado)
    console.log('\n3. Verificación rápida...');
    const isSafe = await client.isImageSafe(testImage);
    console.log(`   - ¿Es segura? ${isSafe ? 'SÍ' : 'NO'}`);

    // Análisis por lotes
    console.log('\n4. Análisis por lotes...');
    const batchImages = [
      { buffer: Buffer.alloc(512 * 1024), filename: 'banner1.jpg', mimeType: 'image/jpeg' },
      { buffer: Buffer.alloc(1.5 * 1024 * 1024), filename: 'banner2.jpg', mimeType: 'image/jpeg' },
      { buffer: Buffer.alloc(4 * 1024 * 1024), filename: 'banner3.jpg', mimeType: 'image/jpeg' }
    ];

    const batchResults = await client.moderateImages(batchImages);
    console.log(`✅ Procesadas ${batchResults.length} imágenes:`);
    
    batchResults.forEach((result, index) => {
      console.log(`   Imagen ${index + 1}: ${result.isSafe ? 'Segura' : 'No segura'} (${result.flaggedCategories.length} categorías)`);
    });

    // Mostrar estadísticas
    console.log('\n5. Estadísticas del cliente:');
    const stats = client.getStats();
    console.log(`   - Inicializado: ${stats.isInitialized ? 'SÍ' : 'NO'}`);
    console.log(`   - Versión: ${stats.version}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      client.dispose();
      console.log('\n🧹 Recursos liberados');
    }
  }
}

// Ejemplo con función de conveniencia
async function convenienceExample() {
  console.log('\n\n🛠️  Ejemplo con función de conveniencia\n');

  try {
    // Método 2: Usar función de conveniencia
    const client = createAdModeratorClient({
      debug: false
    });

    // Configurar análisis
    client.setAnalysisFunction(async (imageBuffer, imageType, options) => {
      console.log('🔍 Análisis rápido...');
      return imageBuffer.length > 1024 * 1024 ? [{
        name: 'large_file',
        confidence: 0.9,
        severity: 'medium'
      }] : [];
    });

    await client.initialize();

    // Probar imagen pequeña
    const smallImage = {
      buffer: Buffer.alloc(512 * 1024),
      filename: 'small.jpg',
      mimeType: 'image/jpeg'
    };

    const isSafe = await client.isImageSafe(smallImage);
    console.log(`✅ Imagen pequeña es segura: ${isSafe ? 'SÍ' : 'NO'}`);

    client.dispose();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Mostrar información de la API
console.log('📦 AdModeratorClient API');
console.log('   - Clase principal: AdModeratorClient');
console.log('   - Función de conveniencia: createAdModeratorClient()');
console.log('   - Métodos principales:');
console.log('     • setAnalysisFunction() - Configurar análisis');
console.log('     • moderateImage() - Moderar una imagen');
console.log('     • moderateImages() - Moderar múltiples imágenes');
console.log('     • isImageSafe() - Verificación rápida');
console.log('     • getStats() - Obtener estadísticas');
console.log('     • dispose() - Liberar recursos\n');

// Ejecutar ejemplos
clientExample()
  .then(() => convenienceExample())
  .catch(console.error);
