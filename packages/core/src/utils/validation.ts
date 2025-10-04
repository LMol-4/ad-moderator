/**
 * Validation utilities for the Ad Moderator library
 */

import { ImageInput, ModerationOptions, AdModeratorConfig } from '../types';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class Validator {
  /**
   * Validates image input
   */
  static validateImageInput(input: ImageInput): void {
    if (!input) {
      throw new ValidationError('Image input is required');
    }

    if (!input.buffer || !Buffer.isBuffer(input.buffer)) {
      throw new ValidationError('Valid image buffer is required', 'buffer');
    }

    if (input.buffer.length === 0) {
      throw new ValidationError('Image buffer cannot be empty', 'buffer');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (input.buffer.length > maxSize) {
      throw new ValidationError(`Image too large (max ${maxSize} bytes)`, 'buffer');
    }

    // Validate MIME type if provided
    if (input.mimeType) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(input.mimeType)) {
        throw new ValidationError(`Unsupported MIME type: ${input.mimeType}`, 'mimeType');
      }
    }
  }

  /**
   * Validates moderation options
   */
  static validateModerationOptions(options: ModerationOptions): void {
    if (options.threshold !== undefined) {
      if (typeof options.threshold !== 'number' || options.threshold < 0 || options.threshold > 1) {
        throw new ValidationError('Threshold must be a number between 0 and 1', 'threshold');
      }
    }

    if (options.categories !== undefined) {
      if (!Array.isArray(options.categories)) {
        throw new ValidationError('Categories must be an array', 'categories');
      }

      if (options.categories.length === 0) {
        throw new ValidationError('Categories array cannot be empty', 'categories');
      }

      for (const category of options.categories) {
        if (typeof category !== 'string' || category.trim().length === 0) {
          throw new ValidationError('Each category must be a non-empty string', 'categories');
        }
      }
    }

    if (options.includeMetadata !== undefined && typeof options.includeMetadata !== 'boolean') {
      throw new ValidationError('includeMetadata must be a boolean', 'includeMetadata');
    }
  }

  /**
   * Validates moderator configuration
   */
  static validateAdModeratorConfig(config: AdModeratorConfig): void {
    if (!config) {
      throw new ValidationError('Configuration is required');
    }

    // Validate default options
    if (!config.defaultOptions) {
      throw new ValidationError('defaultOptions is required');
    }

    this.validateModerationOptions(config.defaultOptions);

    // Validate model configuration
    if (!config.model) {
      throw new ValidationError('model configuration is required');
    }

    const { model } = config;
    
    if (!model.name || typeof model.name !== 'string') {
      throw new ValidationError('Model name is required and must be a string', 'model.name');
    }

    if (!model.version || typeof model.version !== 'string') {
      throw new ValidationError('Model version is required and must be a string', 'model.version');
    }

    if (!model.inputSize) {
      throw new ValidationError('Model input size is required', 'model.inputSize');
    }

    if (typeof model.inputSize.width !== 'number' || model.inputSize.width <= 0) {
      throw new ValidationError('Model input width must be a positive number', 'model.inputSize.width');
    }

    if (typeof model.inputSize.height !== 'number' || model.inputSize.height <= 0) {
      throw new ValidationError('Model input height must be a positive number', 'model.inputSize.height');
    }

    if (typeof model.channels !== 'number' || model.channels < 1 || model.channels > 4) {
      throw new ValidationError('Model channels must be a number between 1 and 4', 'model.channels');
    }

    if (!Array.isArray(model.categories) || model.categories.length === 0) {
      throw new ValidationError('Model categories must be a non-empty array', 'model.categories');
    }

    for (const category of model.categories) {
      if (typeof category !== 'string' || category.trim().length === 0) {
        throw new ValidationError('Each model category must be a non-empty string', 'model.categories');
      }
    }

    if (config.debug !== undefined && typeof config.debug !== 'boolean') {
      throw new ValidationError('debug must be a boolean', 'debug');
    }
  }

  /**
   * Validates that required categories are available in model
   */
  static validateCategoriesAvailable(
    requestedCategories: string[],
    availableCategories: string[]
  ): void {
    const unavailable = requestedCategories.filter(cat => !availableCategories.includes(cat));
    
    if (unavailable.length > 0) {
      throw new ValidationError(
        `Requested categories not available in model: ${unavailable.join(', ')}`,
        'categories'
      );
    }
  }
}
