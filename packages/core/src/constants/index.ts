/**
 * Constants for the Ad Moderator library
 */

export const DEFAULT_CATEGORIES = [
  'explicit',
  'violence',
  'inappropriate',
  'adult_content',
  'hate_speech',
  'drugs',
  'weapons',
  'gore',
  'nudity',
  'sexual_content'
] as const;

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MIN_IMAGE_SIZE = 1024; // 1KB

export const DEFAULT_CLAUDE_CONFIG = {
  baseUrl: 'https://api.anthropic.com/v1',
  model: 'claude-3-sonnet-20240229',
  maxTokens: 1000,
  timeout: 30000,
  debug: false
} as const;

export const DEFAULT_MODERATION_OPTIONS = {
  threshold: 0.5,
  includeMetadata: true
} as const;

export const ERROR_MESSAGES = {
  NOT_INITIALIZED: 'Ad Moderator not initialized. Call initialize() first.',
  MODEL_NOT_LOADED: 'Model not loaded. Call loadModel() first.',
  INVALID_IMAGE: 'Invalid image provided',
  IMAGE_TOO_LARGE: 'Image too large',
  UNSUPPORTED_FORMAT: 'Unsupported image format',
  PROCESSING_FAILED: 'Image processing failed',
  PREDICTION_FAILED: 'Prediction failed',
  VALIDATION_FAILED: 'Validation failed'
} as const;

export const VERSION = '1.0.0';
export const LIBRARY_NAME = 'ad-moderator';
