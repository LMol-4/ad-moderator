import sharp from 'sharp';
import { ImageInput, ModerationMetadata } from '../types';

/**
 * Handles image preprocessing and validation
 */
export class ImageProcessor {
  /**
   * Validates and processes an image for Claude API
   */
  static async processImage(
    input: ImageInput,
    targetSize: { width: number; height: number },
    channels: number = 3
  ): Promise<{
    processedBuffer: Buffer;
    metadata: ModerationMetadata;
  }> {
    const startTime = Date.now();
    
    try {
      // Validate input
      if (!input.buffer || input.buffer.length === 0) {
        throw new Error('Invalid image buffer provided');
      }

      // Get image metadata
      const image = sharp(input.buffer);
      const metadata = await image.metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new Error('Unable to determine image dimensions');
      }

      // For Claude API, we can send the original image or resize if too large
      let processedBuffer = input.buffer;
      
      // Resize only if image is too large (Claude has size limits)
      const maxSize = 2048; // Claude's recommended max size
      if (metadata.width > maxSize || metadata.height > maxSize) {
        processedBuffer = await image
          .resize(maxSize, maxSize, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 90 })
          .toBuffer();
      }

      const processingTime = Date.now() - startTime;

      return {
        processedBuffer,
        metadata: {
          processingTime,
          modelVersion: 'claude-3-sonnet-20240229',
          dimensions: {
            width: metadata.width,
            height: metadata.height
          },
          fileSize: input.buffer.length,
          format: metadata.format || 'unknown'
        }
      };
    } catch (error) {
      throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates image format and size constraints
   */
  static validateImage(input: ImageInput): { isValid: boolean; error?: string } {
    if (!input.buffer || input.buffer.length === 0) {
      return { isValid: false, error: 'Empty image buffer' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (input.buffer.length > maxSize) {
      return { isValid: false, error: 'Image too large (max 10MB)' };
    }

    // Check MIME type if provided
    if (input.mimeType) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(input.mimeType)) {
        return { isValid: false, error: 'Unsupported image format' };
      }
    }

    return { isValid: true };
  }

}
