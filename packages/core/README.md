# Ad Moderator

Una librería TypeScript para detectar imágenes no elegibles para espacios publicitarios públicos usando Claude API.

## Características

- **Integración con Claude**: Análisis de imágenes usando la API de Claude
- **Arquitectura Pluggable**: Integra cualquier función de análisis de imágenes
- **Tipado Fuerte**: Completamente tipado con TypeScript
- **Fácil de Usar**: API simple y clara
- **Moderación Inteligente**: Detecta contenido inapropiado, violencia, contenido explícito, etc.

## Instalación

```bash
npm install ad-moderator
```

## Uso Básico

### Con Claude API (Recomendado)

```typescript
import { AdModeratorClient } from 'ad-moderator';

const client = new AdModeratorClient();

// Configurar Claude API
client.setClaudeAnalyzer('tu-api-key-de-claude');

// Inicializar
await client.initialize();

// Moderar imagen
const result = await client.moderateImage({
  buffer: imageBuffer,
  type: 'image/jpeg',
  name: 'ad-image.jpg'
});

console.log('Es segura:', result.isSafe);
```

### Con función personalizada

```typescript
import { AdModeratorClient } from 'ad-moderator';

const client = new AdModeratorClient();

// Configurar función personalizada
client.setAnalysisFunction(async (imageBuffer, imageType, options) => {
  // Tu lógica de análisis aquí
  return [{
    name: 'inappropriate_content',
    confidence: 0.85,
    severity: 'high'
  }];
});

// Inicializar y usar
await client.initialize();
const result = await client.moderateImage(image);
```

## API

### AdModeratorClient

#### `setClaudeAnalyzer(apiKey: string)`
Configura el cliente para usar Claude API directamente.

#### `setAnalysisFunction(function: AnalysisFunction)`
Configura una función personalizada de análisis.

#### `initialize(): Promise<void>`
Inicializa el cliente.

#### `moderateImage(image: ImageInput, options?: ModerationOptions): Promise<ModerationResult>`
Modera una imagen individual.

#### `moderateImages(images: ImageInput[], options?: ModerationOptions): Promise<ModerationResult[]>`
Modera múltiples imágenes.

#### `isImageSafe(image: ImageInput, options?: ModerationOptions): Promise<boolean>`
Verifica si una imagen es segura para anuncios.

## Tipos

```typescript
interface ImageInput {
  buffer: Buffer;
  type: string;
  name?: string;
}

interface ModerationResult {
  isSafe: boolean;
  confidence: number;
  categories: ModerationCategory[];
  metadata?: any;
}

interface ModerationCategory {
  name: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

## Ejemplos

### Moderar una imagen

```typescript
import { AdModeratorClient } from 'ad-moderator';
import fs from 'fs';

const client = new AdModeratorClient();
client.setClaudeAnalyzer('tu-api-key');
await client.initialize();

// Cargar imagen
const imageBuffer = fs.readFileSync('imagen.jpg');
const result = await client.moderateImage({
  buffer: imageBuffer,
  type: 'image/jpeg',
  name: 'imagen.jpg'
});

if (result.isSafe) {
  console.log('✅ Imagen aprobada para anuncios');
} else {
  console.log('❌ Imagen rechazada:', result.categories);
}
```

### Moderar múltiples imágenes

```typescript
const images = [
  { buffer: image1Buffer, type: 'image/jpeg', name: 'img1.jpg' },
  { buffer: image2Buffer, type: 'image/png', name: 'img2.png' }
];

const results = await client.moderateImages(images);
results.forEach((result, index) => {
  console.log(`Imagen ${index + 1}: ${result.isSafe ? 'Segura' : 'No segura'}`);
});
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar
npm run build

# Ejecutar en modo desarrollo
npm run dev

# Linting
npm run lint
```

## Licencia

MIT