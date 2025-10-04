# 🔒 Política de Seguridad - Ad Moderator

## Protección del Código Interno

### ¿Qué está protegido?

- ✅ **Código fuente**: Completamente ofuscado y minificado
- ✅ **Algoritmos**: Lógica interna no visible
- ✅ **Implementación**: Detalles técnicos ocultos
- ✅ **Optimizaciones**: Mejoras de rendimiento protegidas

### ¿Qué pueden ver los usuarios?

- ✅ **API pública**: Funciones y métodos documentados
- ✅ **Tipos TypeScript**: Interfaces y tipos de datos
- ✅ **Documentación**: Guías de uso y ejemplos
- ✅ **Configuración**: Opciones de personalización

## Estructura del Paquete NPM

```
ad-moderator/
├── dist-obfuscated/          # Código ofuscado (lo que ven los usuarios)
│   ├── index.js              # Punto de entrada ofuscado
│   ├── core/                 # Módulos principales ofuscados
│   ├── analyzers/            # Analizadores ofuscados
│   └── *.d.ts                # Archivos de tipos (legibles)
├── README.md                 # Documentación pública
└── package.json              # Metadatos del paquete
```

## Niveles de Protección

### 1. **Ofuscación de Código**
- Nombres de variables y funciones cambiados
- Código minificado y comprimido
- Lógica interna ilegible

### 2. **Exclusión de Archivos**
- Código fuente TypeScript excluido
- Scripts de build excluidos
- Archivos de configuración excluidos

### 3. **Documentación Controlada**
- Solo API pública documentada
- Ejemplos de uso proporcionados
- Tipos TypeScript para IntelliSense

## Para Desarrolladores

### Compilar con Ofuscación
```bash
npm run build:obfuscated
```

### Publicar Versión Ofuscada
```bash
npm run publish:obfuscated
```

### Verificar Protección
```bash
# Verificar que el código está ofuscado
cat dist-obfuscated/index.js
```

## Beneficios de la Protección

1. **Protección de IP**: Algoritmos propietarios protegidos
2. **Seguridad**: Lógica interna no expuesta
3. **Competitividad**: Ventajas técnicas mantenidas
4. **Control**: Solo funcionalidad pública accesible

## Cumplimiento Legal

- ✅ **MIT License**: Permite uso comercial
- ✅ **Código ofuscado**: Protección de propiedad intelectual
- ✅ **API pública**: Funcionalidad accesible
- ✅ **Documentación**: Uso transparente

## Contacto

Para preguntas sobre seguridad o reportar vulnerabilidades:
- Email: security@ad-moderator.com
- GitHub Issues: [Reportar problema](https://github.com/yourusername/ad-moderator/issues)
