# Ad Moderator

A simple TypeScript library for detecting images and videos not suitable for public advertising using Claude AI.

## Installation

```bash
npm install ad-moderator
```

## Usage

```typescript
import { AdModeratorClient } from 'ad-moderator';

// Initialize with your Anthropic API key
const client = new AdModeratorClient('your-anthropic-api-key');

// Check if an image is safe for advertising (using default flags)
const imageBuffer = Buffer.from('your-image-data');
const result = await client.getAdStatus(imageBuffer);

if (result?.isAdCompliant) {
  console.log('✅ Image is safe for advertising');
} else {
  console.log('❌ Image is not safe for advertising');
  console.log('Reasons:', result?.negativeReasons);
}

// Check if a video is safe for advertising (using default flags)
const videoBuffer = Buffer.from('your-video-data');
const videoResult = await client.getVideoAdStatus(videoBuffer);

if (videoResult?.isAdCompliant) {
  console.log('✅ Video is safe for advertising');
} else {
  console.log('❌ Video is not safe for advertising');
  console.log('Reasons:', videoResult?.negativeReasons);
}

// Check with custom flags (added to default flags)
const customResult = await client.getAdStatus(imageBuffer, {
  customFlags: [
    'Adult or sexual content',
    'Violent or graphic content',
    'Illegal drugs and controlled substances'
  ]
});

// Check with only custom flags (override default flags)
const overrideResult = await client.getAdStatus(imageBuffer, {
  customFlags: [
    'Adult or sexual content',
    'Violent or graphic content'
  ],
  useOnlyCustomFlags: true
});

// Video moderation with custom flags
const customVideoResult = await client.getVideoAdStatus(videoBuffer, {
  customFlags: [
    'Adult or sexual content',
    'Violent or graphic content'
  ]
});
```

## How Video Moderation Works

The video moderation feature works by:

1. **Extracting Screenshots**: The video is processed using FFmpeg to extract screenshots every 0.5 seconds
2. **Image Analysis**: Each screenshot is analyzed using the same image moderation logic
3. **Aggregated Results**: If any screenshot fails moderation, the entire video is marked as non-compliant
4. **Cleanup**: Temporary files are automatically cleaned up after processing

**Note**: Video processing requires FFmpeg to be installed on your system. The library extracts screenshots at 320x240 resolution for faster processing.

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Initialize with your Anthropic API key
- `getAdStatus(imageBuffer: Buffer, options?: AdModerationOptions)` - Check image compliance
- `getVideoAdStatus(videoBuffer: Buffer, options?: AdModerationOptions)` - Check video compliance by analyzing screenshots

### Types

```typescript
interface AdStatus {
  isAdCompliant: boolean;
  negativeReasons?: string[];
}

interface AdModerationOptions {
  customFlags?: string[];
  useOnlyCustomFlags?: boolean;
}
```

## Requirements

- Node.js >= 16.0.0
- Anthropic API key
- FFmpeg (for video processing)

## License

MIT

---

## Spanish

# Ad Moderator

Una librería simple de TypeScript para detectar imágenes y videos no aptos para publicidad usando Claude AI.

## Instalación

```bash
npm install ad-moderator
```

## Uso

```typescript
import { AdModeratorClient } from 'ad-moderator';

// Inicializar con tu clave API de Anthropic
const client = new AdModeratorClient('tu-clave-api-anthropic');

// Verificar si una imagen es segura para publicidad (usando flags por defecto)
const imageBuffer = Buffer.from('datos-de-tu-imagen');
const result = await client.getAdStatus(imageBuffer);

if (result?.isAdCompliant) {
  console.log('✅ La imagen es segura para publicidad');
} else {
  console.log('❌ La imagen no es segura para publicidad');
  console.log('Razones:', result?.negativeReasons);
}

// Verificar si un video es seguro para publicidad (usando flags por defecto)
const videoBuffer = Buffer.from('datos-de-tu-video');
const videoResult = await client.getVideoAdStatus(videoBuffer);

if (videoResult?.isAdCompliant) {
  console.log('✅ El video es seguro para publicidad');
} else {
  console.log('❌ El video no es seguro para publicidad');
  console.log('Razones:', videoResult?.negativeReasons);
}

// Verificar con flags personalizados (agregados a los flags por defecto)
const customResult = await client.getAdStatus(imageBuffer, {
  customFlags: [
    'Contenido adulto o sexual',
    'Contenido violento o gráfico',
    'Drogas ilegales y sustancias controladas'
  ]
});

// Verificar solo con flags personalizados (sobrescribir flags por defecto)
const overrideResult = await client.getAdStatus(imageBuffer, {
  customFlags: [
    'Contenido adulto o sexual',
    'Contenido violento o gráfico'
  ],
  useOnlyCustomFlags: true
});

// Moderación de video con flags personalizados
const customVideoResult = await client.getVideoAdStatus(videoBuffer, {
  customFlags: [
    'Contenido adulto o sexual',
    'Contenido violento o gráfico'
  ]
});
```

## Cómo Funciona la Moderación de Video

La función de moderación de video funciona de la siguiente manera:

1. **Extracción de Capturas**: El video se procesa usando FFmpeg para extraer capturas de pantalla cada 0.5 segundos
2. **Análisis de Imagen**: Cada captura se analiza usando la misma lógica de moderación de imágenes
3. **Resultados Agregados**: Si cualquier captura falla la moderación, todo el video se marca como no conforme
4. **Limpieza**: Los archivos temporales se limpian automáticamente después del procesamiento

**Nota**: El procesamiento de video requiere que FFmpeg esté instalado en tu sistema. La librería extrae capturas a resolución 320x240 para un procesamiento más rápido.

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Inicializar con tu clave API de Anthropic
- `getAdStatus(imageBuffer: Buffer, options?: AdModerationOptions)` - Verificar cumplimiento de imagen
- `getVideoAdStatus(videoBuffer: Buffer, options?: AdModerationOptions)` - Verificar cumplimiento de video analizando capturas de pantalla

### Tipos

```typescript
interface AdStatus {
  isAdCompliant: boolean;
  negativeReasons?: string[];
}

interface AdModerationOptions {
  customFlags?: string[];
  useOnlyCustomFlags?: boolean;
}
```

## Requisitos

- Node.js >= 16.0.0
- Clave API de Anthropic
- FFmpeg (para procesamiento de video)

## Licencia

MIT