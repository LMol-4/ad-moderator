/**
 * Ad Moderator - A TypeScript library for detecting images not eligible for public ad spaces
 * 
 * This library uses machine learning to automatically moderate images and determine
 * if they are safe for use in public advertising spaces.
 */

export { AdModerator } from './core/AdModerator';
export { AdModeratorClient, createAdModeratorClient } from './core/AdModeratorClient';
export { ImageProcessor } from './core/ImageProcessor';
export { ModelManager } from './core/ModelManager';

// Export analyzers
export { ImageAnalyzer, BaseImageAnalyzer, FunctionAnalyzer } from './analyzers/ImageAnalyzer';
export { SimpleAnalyzer } from './analyzers/SimpleAnalyzer';
export { ClaudeAnalyzer } from './analyzers/ClaudeAnalyzer';

// Export all types
export * from './types';

// Default configuration for common use cases
export const DEFAULT_CONFIG = {
  defaultOptions: {
    threshold: 0.5,
    categories: ['explicit', 'violence', 'inappropriate', 'adult_content'],
    includeMetadata: true
  },
  model: {
    name: 'ad-moderation',
    version: '1.0.0',
    inputSize: { width: 224, height: 224 },
    channels: 3,
    categories: ['explicit', 'violence', 'inappropriate', 'adult_content', 'hate_speech']
  },
  debug: false
} as const;

// Convenience function to create a pre-configured AdModerator instance
export function createAdModerator(config?: Partial<typeof DEFAULT_CONFIG>) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { AdModerator } = require('./core/AdModerator');
  return new AdModerator(mergedConfig);
}

// Version information
export const VERSION = '1.0.0';