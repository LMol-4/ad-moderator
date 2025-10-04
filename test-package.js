/**
 * Test del paquete Ad Moderator
 * 
 * Este script prueba la funcionalidad básica del paquete
 */

const { AdModeratorClient } = require('./packages/core/dist');

async function testPackage() {
  console.log('📦 Ad Moderator Package Test');
  console.log('   - Versión: 1.0.0');
  console.log('   - Tipo: TypeScript Library');
  console.log('   - Arquitectura: Pluggable');
  console.log('   - Integración: Claude API\n');

  console.log('🧪 Probando el paquete Ad Moderator\n');

  try {
    // 1. Crear cliente
    console.log('1. Creando cliente...');
    const client = new AdModeratorClient();
    console.log('✅ Cliente creado\n');

    // 2. Configurar función de análisis simple
    console.log('2. Configurando función de análisis...');
    client.setAnalysisFunction(async (imageBuffer, imageType, options) => {
      // Simulación de análisis
      const isSafe = Math.random() > 0.3; // 70% de probabilidad de ser seguro
      
      if (!isSafe) {
        return [{
          name: 'inappropriate_content',
          confidence: 0.85,
          severity: 'high',
          reason: 'Contenido detectado como inapropiado'
        }];
      }
      
      return [];
    });
    console.log('✅ Función de análisis configurada\n');

    // 3. Inicializar
    console.log('3. Inicializando cliente...');
    await client.initialize();
    console.log('✅ Cliente inicializado\n');

    // 4. Crear imagen de prueba
    console.log('4. Creando imagen de prueba...');
    const imagenPrueba = {
      buffer: Buffer.from('imagen_simulada'),
      type: 'image/jpeg',
      name: 'test-image.jpg'
    };
    console.log('✅ Imagen de prueba creada\n');

    // 5. Moderar imagen
    console.log('5. Moderando imagen...');
    const resultado = await client.moderateImage(imagenPrueba);
    
    console.log('📊 Resultado de moderación:');
    console.log(`   - Es segura: ${resultado.isSafe ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   - Confianza: ${resultado.confidence}`);
    console.log(`   - Categorías detectadas: ${resultado.categories.length}`);
    
    if (resultado.categories.length > 0) {
      console.log('   - Detalles:');
      resultado.categories.forEach(cat => {
        console.log(`     • ${cat.name}: ${cat.confidence} (${cat.severity})`);
        console.log(`       Razón: ${cat.reason}`);
      });
    }

    // 6. Verificar si es segura
    console.log('\n6. Verificación rápida...');
    const esSegura = await client.isImageSafe(imagenPrueba);
    console.log(`   Resultado: ${esSegura ? '✅ SEGURA' : '❌ NO SEGURA'}`);

    // 7. Estadísticas
    console.log('\n7. Estadísticas del cliente:');
    const stats = client.getStats();
    console.log(`   - Inicializado: ${stats.isInitialized}`);
    console.log(`   - Versión: ${stats.version}`);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Pega el código de clients.ts en ClaudeAnalyzer.ts');
    console.log('   2. Compila: npm run build');
    console.log('   3. Prueba: node examples/claude-direct-example.js');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar pruebas
if (require.main === module) {
  testPackage();
}

module.exports = { testPackage };