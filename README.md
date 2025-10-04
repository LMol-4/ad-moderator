# Ad Moderator Monorepo

Un sistema completo de moderación de imágenes con arquitectura pluggable, que incluye una librería NPM y funciones de Firebase.

## 🏗️ **Estructura del Monorepo**

```
ad-moderator/
├── packages/
│   ├── core/                    # 📦 Librería NPM principal
│   │   ├── src/                # Código fuente TypeScript
│   │   ├── dist/               # Código compilado (publicado en NPM)
│   │   ├── package.json        # Configuración del package NPM
│   │   └── README.md           # Documentación de la librería
│   │
│   └── firebase-functions/     # 🔥 Firebase Functions
│       ├── src/                # Código fuente de las funciones
│       ├── lib/                # Código compilado
│       ├── package.json        # Dependencias de Firebase
│       └── firebase.json       # Configuración de Firebase
│
├── examples/                   # 📚 Ejemplos de uso
├── docs/                      # 📖 Documentación adicional
├── scripts/                   # 🔧 Scripts de utilidad
├── package.json              # Configuración del monorepo
├── pnpm-workspace.yaml       # Configuración de workspaces
└── README.md                 # Este archivo
```

## 🚀 **Inicio Rápido**

### **1. Configurar el Monorepo**

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/ad-moderator.git
cd ad-moderator

# Ejecutar script de configuración
chmod +x scripts/setup-monorepo.sh
./scripts/setup-monorepo.sh

# Instalar dependencias
pnpm install
```

### **2. Desarrollar**

```bash
# Compilar todo
pnpm run build

# Compilar solo la librería
pnpm run build:core

# Compilar solo las funciones
pnpm run build:functions

# Desarrollo en modo watch
pnpm run dev
```

### **3. Probar**

```bash
# Probar la librería
cd packages/core
node test-claude.js

# Probar las funciones localmente
cd packages/firebase-functions
pnpm run serve
```

## 📦 **Librería NPM (packages/core)**

Una librería TypeScript pluggable para moderación de imágenes.

### **Instalación**

```bash
npm install ad-moderator
```

### **Uso Básico**

```typescript
import { createAdModerator, FunctionAnalyzer } from 'ad-moderator';

// Tu función de análisis
async function myAnalysis(imageBuffer, imageType, options) {
  // Tu lógica aquí
  return [];
}

// Configurar moderador
const moderator = createAdModerator();
const analyzer = new FunctionAnalyzer('my-analyzer', myAnalysis);
moderator.setAnalyzer(analyzer);
await moderator.initialize();

// Moderar imagen
const result = await moderator.moderateImage({
  buffer: imageBuffer,
  filename: 'image.jpg',
  mimeType: 'image/jpeg'
});
```

### **Publicar en NPM**

```bash
# Publicar solo la librería
pnpm run publish:core

# O usar el script completo
./scripts/deploy-all.sh --npm
```

## 🔥 **Firebase Functions (packages/firebase-functions)**

API serverless para moderación de imágenes usando Firebase Functions.

### **Configurar Firebase**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión
firebase login

# Configurar proyecto
cd packages/firebase-functions
firebase init functions
```

### **Configurar Variables de Entorno**

```bash
# Configurar API key de Claude
firebase functions:config:set claude.api_key="tu-api-key-aqui"

# O usar .env (para desarrollo local)
echo "CLAUDE_API_KEY=tu-api-key-aqui" > .env
```

### **Desplegar**

```bash
# Desplegar solo las funciones
pnpm run deploy:functions

# O usar el script completo
./scripts/deploy-all.sh --firebase
```

### **Usar la API**

```javascript
// HTTP Function
const response = await fetch('https://your-project.cloudfunctions.net/moderateImage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageData: base64Image,
    imageType: 'jpeg',
    options: { threshold: 0.7 }
  })
});

// Callable Function (con Firebase SDK)
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const moderateImage = httpsCallable(functions, 'moderateImageCallable');

const result = await moderateImage({
  imageData: base64Image,
  imageType: 'jpeg',
  options: { threshold: 0.7 }
});
```

## 🔧 **Scripts Disponibles**

### **Scripts del Monorepo**

```bash
# Desarrollo
pnpm run build              # Compilar todo
pnpm run dev               # Desarrollo en modo watch
pnpm run lint              # Linter
pnpm run lint:fix          # Arreglar problemas de linting

# Packages específicos
pnpm run build:core        # Compilar solo la librería
pnpm run build:functions   # Compilar solo las funciones

# Despliegue
pnpm run publish:core      # Publicar en NPM
pnpm run deploy:functions  # Desplegar en Firebase
```

### **Scripts de Utilidad**

```bash
# Configurar monorepo
./scripts/setup-monorepo.sh

# Desplegar todo
./scripts/deploy-all.sh --all

# Desplegar solo NPM
./scripts/deploy-all.sh --npm

# Desplegar solo Firebase
./scripts/deploy-all.sh --firebase
```

## 🏗️ **Arquitectura**

### **Librería NPM**
- **Propósito**: Librería reutilizable para cualquier proyecto
- **Tecnologías**: TypeScript, Sharp, Axios
- **Características**: Pluggable, sin dependencias específicas de APIs

### **Firebase Functions**
- **Propósito**: API serverless para moderación de imágenes
- **Tecnologías**: Firebase Functions, TypeScript
- **Características**: Escalable, sin servidor, integración con Firebase

### **Sistema Pluggable**
- **FunctionAnalyzer**: Conectar cualquier función de análisis
- **BaseImageAnalyzer**: Crear analizadores personalizados
- **Flexibilidad**: Funciona con cualquier API o modelo ML

## 📚 **Ejemplos**

### **Ejemplo 1: Análisis con Claude API**

```typescript
import { FunctionAnalyzer } from 'ad-moderator';

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

const analyzer = new FunctionAnalyzer('claude-analyzer', claudeAnalysis);
```

### **Ejemplo 2: Análisis con API Externa**

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

const analyzer = new FunctionAnalyzer('external-api', externalApiAnalysis);
```

## 🔒 **Configuración de Producción**

### **Variables de Entorno**

```bash
# Firebase Functions
firebase functions:config:set \
  claude.api_key="sk-ant-..." \
  analysis.timeout="30000"

# Desarrollo local
echo "CLAUDE_API_KEY=sk-ant-..." > .env
```

### **Límites y Configuración**

- **Firebase Functions**: 1GB RAM, 60s timeout
- **NPM Package**: Sin límites (depende del host)
- **Imágenes**: Máximo 10MB por imagen

## 🤝 **Contribuir**

1. Fork el repositorio
2. Crear una rama: `git checkout -b feature/nueva-funcionalidad`
3. Hacer cambios y commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 **Licencia**

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🔗 **Enlaces**

- **NPM Package**: https://www.npmjs.com/package/ad-moderator
- **Firebase Console**: https://console.firebase.google.com/
- **Documentación**: https://github.com/yourusername/ad-moderator#readme
- **Issues**: https://github.com/yourusername/ad-moderator/issues

---

¡Desarrollado con ❤️ para la comunidad de desarrolladores!