/**
 * Ejemplo de uso con Firebase Functions + Claude
 * 
 * Este ejemplo muestra cómo usar la librería con la función de Firebase
 * que se comunicará con la API de Claude
 */

const { AdModeratorClient, createAdModeratorClient } = require('../packages/core/dist/index');

async function firebaseExample() {
  console.log('🔥 Ejemplo con Firebase Functions + Claude\n');

  try {
    // Crear cliente
    const client = new AdModeratorClient({
      debug: true
    });

    // Configurar función de Firebase
    // TODO: Reemplazar con la URL real de tu función de Firebase
    const firebaseFunctionUrl = 'https://your-project-id.cloudfunctions.net/analyzeImageWithClaude';
    const apiKey = 'your-firebase-api-key'; // Opcional

    console.log('1. Configurando función de Firebase...');
    client.setFirebaseFunction(firebaseFunctionUrl, apiKey);
    console.log('✅ Función de Firebase configurada\n');

    // Inicializar
    console.log('2. Inicializando cliente...');
    await client.initialize();
    console.log('✅ Cliente inicializado\n');

    // Analizar imagen
    console.log('3. Analizando imagen con Claude...');
    const testImage = {
      buffer: Buffer.alloc(2 * 1024 * 1024), // 2MB
      filename: 'advertisement.jpg',
      mimeType: 'image/jpeg'
    };

    const result = await client.moderateImage(testImage);
    
    console.log('✅ Resultado del análisis:');
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

    // Verificación rápida
    console.log('\n4. Verificación rápida...');
    const isSafe = await client.isImageSafe(testImage);
    console.log(`   - ¿Es segura? ${isSafe ? 'SÍ' : 'NO'}`);

    // Análisis por lotes
    console.log('\n5. Análisis por lotes...');
    const batchImages = [
      { buffer: Buffer.alloc(512 * 1024), filename: 'banner1.jpg', mimeType: 'image/jpeg' },
      { buffer: Buffer.alloc(1.5 * 1024 * 1024), filename: 'banner2.jpg', mimeType: 'image/jpeg' },
      { buffer: Buffer.alloc(3 * 1024 * 1024), filename: 'banner3.jpg', mimeType: 'image/jpeg' }
    ];

    const batchResults = await client.moderateImages(batchImages);
    console.log(`✅ Procesadas ${batchResults.length} imágenes:`);
    
    batchResults.forEach((result, index) => {
      console.log(`   Imagen ${index + 1}: ${result.isSafe ? 'Segura' : 'No segura'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (typeof client !== 'undefined') {
      client.dispose();
      console.log('\n🧹 Recursos liberados');
    }
  }
}

// Ejemplo con función de conveniencia
async function convenienceFirebaseExample() {
  console.log('\n\n🛠️  Ejemplo con función de conveniencia\n');

  try {
    // Crear cliente con función de conveniencia
    const client = createAdModeratorClient({
      debug: false
    });

    // Configurar Firebase
    const firebaseFunctionUrl = 'https://your-project-id.cloudfunctions.net/analyzeImageWithClaude';
    client.setFirebaseFunction(firebaseFunctionUrl);

    await client.initialize();

    // Probar imagen
    const testImage = {
      buffer: Buffer.alloc(1 * 1024 * 1024), // 1MB
      filename: 'test.jpg',
      mimeType: 'image/jpeg'
    };

    const isSafe = await client.isImageSafe(testImage);
    console.log(`✅ Imagen es segura: ${isSafe ? 'SÍ' : 'NO'}`);

    client.dispose();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Mostrar información sobre la integración
console.log('🔥 Firebase Functions + Claude Integration');
console.log('   - Función de Firebase: analyzeImageWithClaude');
console.log('   - API de Claude: Integrada en Firebase');
console.log('   - Respuesta: Boolean (isSafe)');
console.log('   - Configuración: setFirebaseFunction()\n');

console.log('📋 Pasos para configurar:');
console.log('   1. Desplegar función de Firebase');
console.log('   2. Obtener URL de la función');
console.log('   3. Configurar con setFirebaseFunction()');
console.log('   4. ¡Listo para usar!\n');

// Ejecutar ejemplos
firebaseExample()
  .then(() => convenienceFirebaseExample())
  .catch(console.error);
