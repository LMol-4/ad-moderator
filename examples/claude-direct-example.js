/**
 * Ejemplo de uso directo con Claude API
 * 
 * Este ejemplo muestra cómo usar la librería con Claude directamente
 * sin necesidad de Firebase Functions.
 */

const { AdModeratorClient } = require('../packages/core/dist');

async function ejemploClaudeDirecto() {
  console.log('🚀 Ejemplo de uso directo con Claude API\n');

  try {
    // 1. Crear cliente
    const client = new AdModeratorClient();

    // 2. Configurar Claude (reemplaza con tu API key real)
    const claudeApiKey = process.env.CLAUDE_API_KEY || 'tu-api-key-aqui';
    client.setClaudeAnalyzer(claudeApiKey);

    // 3. Inicializar
    console.log('Inicializando cliente...');
    await client.initialize();
    console.log('✅ Cliente inicializado\n');

    // 4. Crear imagen de prueba (simulada)
    const imagenPrueba = {
      buffer: Buffer.from('imagen_simulada'),
      type: 'image/jpeg',
      name: 'test-image.jpg'
    };

    // 5. Moderar imagen
    console.log('Moderando imagen...');
    const resultado = await client.moderateImage(imagenPrueba);
    
    console.log('📊 Resultado de moderación:');
    console.log(`   - Es segura: ${resultado.isSafe ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   - Confianza: ${resultado.confidence}`);
    console.log(`   - Categorías detectadas: ${resultado.categories.length}`);
    
    if (resultado.categories.length > 0) {
      console.log('   - Detalles:');
      resultado.categories.forEach(cat => {
        console.log(`     • ${cat.name}: ${cat.confidence} (${cat.severity})`);
      });
    }

    // 6. Verificar si es segura
    const esSegura = await client.isImageSafe(imagenPrueba);
    console.log(`\n🔍 Verificación rápida: ${esSegura ? '✅ SEGURA' : '❌ NO SEGURA'}`);

    // 7. Estadísticas
    const stats = client.getStats();
    console.log('\n📈 Estadísticas del cliente:');
    console.log(`   - Inicializado: ${stats.isInitialized}`);
    console.log(`   - Versión: ${stats.version}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar ejemplo
if (require.main === module) {
  ejemploClaudeDirecto();
}

module.exports = { ejemploClaudeDirecto };
