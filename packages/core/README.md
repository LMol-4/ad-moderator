# Ad Moderator Core

Una librería TypeScript pluggable para moderación de imágenes con arquitectura flexible.

## 🚀 **Instalación**

```bash
npm install ad-moderator
```

## 📖 **Uso Básico**

### **Con Firebase Functions + Claude (Recomendado)**

```typescript
import { AdModeratorClient } from 'ad-moderator';

// Crear cliente
const client = new AdModeratorClient();

// Configurar función de Firebase que se comunica con Claude
client.setFirebaseFunction(
  'https://your-project-id.cloudfunctions.net/analyzeImageWithClaude',
  'your-api-key' // Opcional
);

// Inicializar y usar
await client.initialize();
const result = await client.moderateImage({
  buffer: imageBuffer,
  filename: 'image.jpg',
  mimeType: 'image/jpeg'
});
```

### **Con función personalizada**

```typescript
import { AdModeratorClient } from 'ad-moderator';

// Crear cliente
const client = new AdModeratorClient();

// Configurar función de análisis personalizada
client.setAnalysisFunction(async (imageBuffer, imageType, options) => {
  // Tu lógica aquí - puede ser cualquier cosa:
  // - Llamada a API externa
  // - Modelo de ML local
  // - Análisis de metadatos
  return [];
});

// Inicializar y usar
await client.initialize();
const result = await client.moderateImage({
  buffer: imageBuffer,
  filename: 'image.jpg',
  mimeType: 'image/jpeg'
});
```

## 🔌 **Sistema de Plugins**

### **FunctionAnalyzer (Más Fácil)**

```typescript
import { FunctionAnalyzer } from 'ad-moderator';

const analyzer = new FunctionAnalyzer('my-analyzer', async (imageBuffer, imageType, options) => {
  // Tu lógica de análisis aquí
  return [
    {
      name: 'inappropriate',
      confidence: 0.8,
      severity: 'high'
    }
  ];
});
```

### **BaseImageAnalyzer (Para Casos Avanzados)**

```typescript
import { BaseImageAnalyzer } from 'ad-moderator';

class MyAnalyzer extends BaseImageAnalyzer {
  constructor() {
    super('my-analyzer', '1.0.0');
  }

  async analyze(imageBuffer, imageType, options) {
    // Tu lógica aquí
    return [];
  }
}
```

## 📚 **Ejemplos**

### **Claude API**

```typescript
async function claudeAnalysis(imageBuffer, imageType, options) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this image for inappropriate content' },
          { type: 'image', source: { type: 'base64', media_type: `image/${imageType}`, data: imageBuffer.toString('base64') } }
        ]
      }]
    })
  });
  
  const result = await response.json();
  return parseClaudeResponse(result);
}
```

### **API Externa**

```typescript
async function externalApiAnalysis(imageBuffer, imageType, options) {
  const response = await fetch('https://your-api.com/analyze', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.API_KEY}` },
    body: imageBuffer
  });
  
  const result = await response.json();
  return result.categories || [];
}
```

## 🔧 **API Reference**

### **AdModerator**

```typescript
class AdModerator {
  constructor(config: AdModeratorConfig);
  setAnalyzer(analyzer: ImageAnalyzer): void;
  initialize(): Promise<void>;
  moderateImage(input: ImageInput, options?: ModerationOptions): Promise<ModerationResult>;
  moderateImages(inputs: ImageInput[], options?: ModerationOptions): Promise<ModerationResult[]>;
  dispose(): void;
}
```

### **FunctionAnalyzer**

```typescript
class FunctionAnalyzer extends BaseImageAnalyzer {
  constructor(
    name: string,
    analyzeFunction: (imageBuffer: Buffer, imageType: string, options: ModerationOptions) => Promise<ModerationCategory[]>,
    version?: string
  );
}
```

### **Tipos**

```typescript
interface ModerationResult {
  isSafe: boolean;
  confidence: number;
  flaggedCategories: ModerationCategory[];
  metadata: ModerationMetadata;
}

interface ModerationCategory {
  name: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ImageInput {
  buffer: Buffer;
  filename?: string;
  mimeType?: string;
}
```

## 🚀 **Desarrollo**

```bash
# Instalar dependencias
pnpm install

# Compilar
pnpm run build

# Desarrollo
pnpm run dev

# Linting
pnpm run lint
```

## 📄 **Licencia**

MIT License - ver [LICENSE](../../LICENSE) para más detalles.
