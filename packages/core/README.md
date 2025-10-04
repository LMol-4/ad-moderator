# Ad Moderator

A simple TypeScript library for detecting images not suitable for public advertising using Claude AI.

## Installation

```bash
npm install ad-moderator
```

## Usage

```typescript
import { AdModeratorClient } from 'ad-moderator';

// Initialize with your Anthropic API key
const client = new AdModeratorClient('your-anthropic-api-key');

// Check if an image is safe for advertising
const imageBuffer = Buffer.from('your-image-data');
const result = await client.getAdStatus(imageBuffer, 'digital');

if (result?.isAdCompliant) {
  console.log('✅ Image is safe for advertising');
} else {
  console.log('❌ Image is not safe for advertising');
  console.log('Reasons:', result?.negativeReasons);
}
```

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Initialize with your Anthropic API key
- `getAdStatus(imageBuffer: Buffer, mediaType: 'digital' | 'physical')` - Check image compliance

### Types

```typescript
interface AdStatus {
  isAdCompliant: boolean;
  negativeReasons?: string[];
}
```

## Requirements

- Node.js >= 16.0.0
- Anthropic API key

## License

MIT

---

## Spanish

# Ad Moderator

Una librería simple de TypeScript para detectar imágenes no aptas para publicidad usando Claude AI.

## Instalación

```bash
npm install ad-moderator
```

## Uso

```typescript
import { AdModeratorClient } from 'ad-moderator';

// Inicializar con tu clave API de Anthropic
const client = new AdModeratorClient('tu-clave-api-anthropic');

// Verificar si una imagen es segura para publicidad
const imageBuffer = Buffer.from('datos-de-tu-imagen');
const result = await client.getAdStatus(imageBuffer, 'digital');

if (result?.isAdCompliant) {
  console.log('✅ La imagen es segura para publicidad');
} else {
  console.log('❌ La imagen no es segura para publicidad');
  console.log('Razones:', result?.negativeReasons);
}
```

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Inicializar con tu clave API de Anthropic
- `getAdStatus(imageBuffer: Buffer, mediaType: 'digital' | 'physical')` - Verificar cumplimiento de imagen

### Tipos

```typescript
interface AdStatus {
  isAdCompliant: boolean;
  negativeReasons?: string[];
}
```

## Requisitos

- Node.js >= 16.0.0
- Clave API de Anthropic

## Licencia

MIT