/**
 * Ejemplo de integración con Claude API
 * Ejecutar con: node examples/claude-integration.js
 */

const { createAdModerator, FunctionAnalyzer } = require('../packages/core/dist/index');

async function claudeIntegrationExample() {
  console.log('🤖 Ejemplo de integración con Claude API\n');

  // Función de análisis usando Claude API
  async function claudeAnalysis(imageBuffer, imageType, options) {
    const categories = [];
    
    try {
      // Convertir imagen a base64
      const base64Image = imageBuffer.toString('base64');
      
      // Llamar a Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY || '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',
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image for content inappropriate for public advertising. 
                       Return JSON format: {"categories": [{"name": "category", "confidence": 0.8, "severity": "high"}]}
                       Only flag categories with confidence >= ${options.threshold || 0.5}.`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: `image/${imageType}`,
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      const result = await response.json();
      
      if (result.content && result.content[0] && result.content[0].text) {
        const analysis = JSON.parse(result.content[0].text);
        if (analysis.categories) {
          analysis.categories.forEach(cat => {
            categories.push({
              name: cat.name,
              confidence: cat.confidence,
              severity: cat.severity || 'medium'
            });
          });
        }
      }

    } catch (error) {
      console.error('Error en Claude API:', error);
      // En caso de error, marcar como inseguro
      categories.push({
        name: 'claude_api_error',
        confidence: 1.0,
        severity: 'critical'
      });
    }

    return categories;
  }

  try {
    // Crear moderador
    const moderator = createAdModerator({
      debug: true,
      defaultOptions: {
        threshold: 0.7,
        categories: ['explicit', 'violence', 'inappropriate', 'adult_content']
      }
    });

    // Configurar analizador de Claude
    const analyzer = new FunctionAnalyzer('claude-analyzer', claudeAnalysis);
    moderator.setAnalyzer(analyzer);

    // Inicializar
    console.log('1. Inicializando moderador con Claude API...');
    await moderator.initialize();
    console.log('✅ Moderador inicializado\n');

    // Probar con imagen
    console.log('2. Analizando imagen con Claude...');
    const testImage = {
      buffer: Buffer.from('sample-image-data'),
      filename: 'test-image.jpg',
      mimeType: 'image/jpeg'
    };

    const result = await moderator.moderateImage(testImage, {
      threshold: 0.5,
      categories: ['explicit', 'violence', 'inappropriate']
    });
    
    console.log('✅ Análisis de Claude completado:');
    console.log(`   - Segura para anuncios: ${result.isSafe ? 'SÍ' : 'NO'}`);
    console.log(`   - Confianza: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   - Tiempo: ${result.metadata.processingTime}ms`);
    console.log(`   - Categorías detectadas: ${result.flaggedCategories.length}`);

    if (result.flaggedCategories.length > 0) {
      console.log('   - Detalles:');
      result.flaggedCategories.forEach(cat => {
        console.log(`     • ${cat.name}: ${(cat.confidence * 100).toFixed(1)}% (${cat.severity})`);
      });
    } else {
      console.log('   - ✅ No se detectaron problemas');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Sugerencias:');
    console.log('   - Verificar que la API key de Claude sea válida');
    console.log('   - Verificar conexión a internet');
    console.log('   - Verificar que el proyecto esté compilado (pnpm run build:core)');
  } finally {
    if (moderator) {
      moderator.dispose();
      console.log('\n🧹 Recursos liberados');
    }
  }
}

// Ejecutar ejemplo
claudeIntegrationExample().catch(console.error);
