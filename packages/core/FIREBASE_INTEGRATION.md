# 🔥 Integración con Firebase Functions + Claude

## Descripción

La librería `AdModeratorClient` está diseñada para trabajar con una función de Firebase que se comunica con la API de Claude para el análisis de imágenes.

## Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AdModerator   │───▶│  Firebase        │───▶│  Claude API     │
│   Client        │    │  Function        │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Configuración

### 1. Configurar la función de Firebase

```javascript
import { AdModeratorClient } from 'ad-moderator';

const client = new AdModeratorClient();

// Configurar función de Firebase
client.setFirebaseFunction(
  'https://your-project-id.cloudfunctions.net/analyzeImageWithClaude',
  'your-api-key' // Opcional
);

await client.initialize();
```

### 2. Formato de la función de Firebase

La función de Firebase debe:

- **Recibir**: POST con imagen en base64
- **Devolver**: JSON con resultado del análisis

#### Entrada esperada:
```json
{
  "image": "base64-encoded-image",
  "imageType": "image/jpeg",
  "options": {
    "threshold": 0.5,
    "categories": ["explicit", "violence"]
  }
}
```

#### Salida esperada:
```json
{
  "isSafe": false,
  "confidence": 0.85,
  "severity": "high",
  "reason": "Contenido inapropiado detectado"
}
```

## Uso

### Análisis de una imagen

```javascript
const result = await client.moderateImage({
  buffer: imageBuffer,
  filename: 'ad.jpg',
  mimeType: 'image/jpeg'
});

console.log(`Es segura: ${result.isSafe}`);
```

### Verificación rápida

```javascript
const isSafe = await client.isImageSafe(image);
```

### Análisis por lotes

```javascript
const results = await client.moderateImages(images);
```

## Manejo de Errores

La librería maneja automáticamente:

- ✅ **Errores de red**: Timeout, conexión fallida
- ✅ **Errores de Firebase**: Función no disponible
- ✅ **Errores de Claude**: API no responde
- ✅ **Errores de formato**: Imagen inválida

## Configuración de Firebase

### Variables de entorno necesarias:

```bash
# En tu función de Firebase
CLAUDE_API_KEY=sk-ant-api03-...
CLAUDE_BASE_URL=https://api.anthropic.com
```

### Estructura de la función:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const { ClaudeAPI } = require('claude-api');

exports.analyzeImageWithClaude = functions.https.onRequest(async (req, res) => {
  try {
    const { image, imageType, options } = req.body;
    
    // Llamar a Claude API
    const claudeResult = await claudeAPI.analyzeImage(image, options);
    
    res.json({
      isSafe: claudeResult.isSafe,
      confidence: claudeResult.confidence,
      severity: claudeResult.severity,
      reason: claudeResult.reason
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Ventajas de esta Arquitectura

1. **Seguridad**: API Key de Claude no expuesta al cliente
2. **Escalabilidad**: Firebase maneja el escalado automático
3. **Monitoreo**: Logs y métricas en Firebase
4. **Caching**: Posibilidad de cachear resultados
5. **Rate Limiting**: Control de límites de API

## Próximos Pasos

1. ✅ **Librería lista**: `AdModeratorClient` implementado
2. 🔄 **Función de Firebase**: En desarrollo por tu compañero
3. ⏳ **Testing**: Pruebas de integración
4. ⏳ **Deploy**: Despliegue a producción

## Contacto

Para preguntas sobre la integración:
- Email: dev@ad-moderator.com
- GitHub: [Issues](https://github.com/yourusername/ad-moderator/issues)
