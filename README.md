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

// Check if an image is safe for advertising (using default flags)
const imageBuffer = Buffer.from('your-image-data');
const result = await client.getAdStatus(imageBuffer);

if (result?.isAdCompliant) {
  console.log('✅ Image is safe for advertising');
} else {
  console.log('❌ Image is not safe for advertising');
  console.log('Reasons:', result?.negativeReasons);
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
```

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Initialize with your Anthropic API key
- `getAdStatus(imageBuffer: Buffer, options?: AdModerationOptions)` - Check image compliance

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

### Default Flags

The library comes with a comprehensive set of default flags for content moderation:

- Tobacco and related products
- Illegal drugs and controlled substances
- Prescription or controlled medications
- Counterfeit or imitation goods
- Weapons and ammunition
- Gambling and betting (unless licensed)
- Adult or sexual content
- Alcohol (depending on country or location)
- Cryptocurrencies and high-risk financial products
- Extremist, political, or religious propaganda
- Violent or graphic content
- Predatory or short-term lending
- Discriminatory or hateful content
- Hacking or malicious software
- Miracle or pseudoscientific products
- Data sales or surveillance services
- Illegal or unregulated services

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

// Verificar si una imagen es segura para publicidad (usando flags por defecto)
const imageBuffer = Buffer.from('datos-de-tu-imagen');
const result = await client.getAdStatus(imageBuffer);

if (result?.isAdCompliant) {
  console.log('✅ La imagen es segura para publicidad');
} else {
  console.log('❌ La imagen no es segura para publicidad');
  console.log('Razones:', result?.negativeReasons);
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
```

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Inicializar con tu clave API de Anthropic
- `getAdStatus(imageBuffer: Buffer, options?: AdModerationOptions)` - Verificar cumplimiento de imagen

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

## Licencia

MIT
