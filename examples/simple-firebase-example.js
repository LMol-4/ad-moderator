/**
 * Ejemplo simple con Firebase Functions + Claude
 * 
 * Este ejemplo muestra cómo usar la librería con la función de Firebase
 * que se comunicará con la API de Claude
 */

const { AdModeratorClient } = require('../packages/core/dist/index');

async function simpleFirebaseExample() {
  console.log('🔥 Ejemplo Simple con Firebase Functions + Claude\n');

  try {
    // Crear cliente
    const client = new AdModeratorClient({
      debug: true
    });

    // Configurar función de Firebase
    // TODO: Reemplazar con la URL real de tu función de Firebase
    const firebaseFunctionUrl = 'https://your-project-id.cloudfunctions.net/analyzeImageWithClaude';
    
    console.log('1. Configurando función de Firebase...');
    client.setFirebaseFunction(firebaseFunctionUrl);
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

    // Mostrar estadísticas
    console.log('\n5. Estadísticas del cliente:');
    const stats = client.getStats();
    console.log(`   - Inicializado: ${stats.isInitialized ? 'SÍ' : 'NO'}`);
    console.log(`   - Versión: ${stats.version}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (typeof client !== 'undefined') {
      client.dispose();
      console.log('\n🧹 Recursos liberados');
    }
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

// Ejecutar ejemplo
simpleFirebaseExample().catch(console.error);
