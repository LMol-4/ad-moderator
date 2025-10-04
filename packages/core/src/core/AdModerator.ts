import { ImageProcessor } from './ImageProcessor';
import { ModelManager } from './ModelManager';
import { ImageAnalyzer } from '../analyzers/ImageAnalyzer';
import {
  ImageInput,
  ModerationResult,
  ModerationOptions,
  AdModeratorConfig,
  ModerationCategory
} from '../types';

/**
 * Main Ad Moderator class that orchestrates image moderation
 */
export class AdModerator {
  private modelManager: ModelManager;
  private config: AdModeratorConfig;
  private isInitialized: boolean = false;

  constructor(config: AdModeratorConfig) {
    this.config = config;
    this.modelManager = new ModelManager(config.model);
  }

  /**
   * Sets the image analyzer to use
   */
  setAnalyzer(analyzer: ImageAnalyzer): void {
    this.modelManager.setAnalyzer(analyzer);
  }

  /**
   * Initializes the moderator (loads analyzer, etc.)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.modelManager.loadModel();
      this.isInitialized = true;
      
      if (this.config.debug) {
        console.log('Ad Moderator initialized successfully');
      }
    } catch (error) {
      throw new Error(`Failed to initialize Ad Moderator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Moderates an image for ad eligibility
   */
  async moderateImage(
    input: ImageInput,
    options: ModerationOptions = {}
  ): Promise<ModerationResult> {
    if (!this.isInitialized) {
      throw new Error('Ad Moderator not initialized. Call initialize() first.');
    }

    const startTime = Date.now();

    try {
      // Validate image
      const validation = ImageProcessor.validateImage(input);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Merge options with defaults
      const mergedOptions = { ...this.config.defaultOptions, ...options };

      // Process image for ML model
      const { processedBuffer, metadata } = await ImageProcessor.processImage(
        input,
        this.config.model.inputSize,
        this.config.model.channels
      );

      // Get image type from metadata or filename
      const imageType = this.getImageType(input.filename, input.mimeType);

      // Run Claude API analysis
      const flaggedCategories = await this.modelManager.predict(
        processedBuffer,
        imageType,
        mergedOptions
      );

      // Determine if image is safe
      const isSafe = flaggedCategories.length === 0;
      const confidence = this.calculateOverallConfidence(flaggedCategories);

      const result: ModerationResult = {
        isSafe,
        confidence,
        flaggedCategories,
        metadata: {
          ...metadata,
          processingTime: Date.now() - startTime
        }
      };

      if (this.config.debug) {
        console.log(`Moderation completed: ${isSafe ? 'SAFE' : 'UNSAFE'} (${confidence.toFixed(3)} confidence)`);
      }

      return result;
    } catch (error) {
      throw new Error(`Image moderation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Moderates multiple images in batch
   */
  async moderateImages(
    inputs: ImageInput[],
    options: ModerationOptions = {}
  ): Promise<ModerationResult[]> {
    const results: ModerationResult[] = [];

    for (const input of inputs) {
      try {
        const result = await this.moderateImage(input, options);
        results.push(result);
      } catch (error) {
        // Create error result for failed images
        results.push({
          isSafe: false,
          confidence: 0,
          flaggedCategories: [{
            name: 'processing_error',
            confidence: 1.0,
            severity: 'critical'
          }],
          metadata: {
            processingTime: 0,
            modelVersion: this.config.model.version,
            dimensions: { width: 0, height: 0 },
            fileSize: 0,
            format: 'unknown'
          }
        });
      }
    }

    return results;
  }

  /**
   * Calculates overall confidence score from flagged categories
   */
  private calculateOverallConfidence(categories: ModerationCategory[]): number {
    if (categories.length === 0) {
      return 1.0; // High confidence in safety
    }

    // Return the highest confidence among flagged categories
    return Math.max(...categories.map(cat => cat.confidence));
  }

  /**
   * Gets the current configuration
   */
  getConfig(): AdModeratorConfig {
    return { ...this.config };
  }

  /**
   * Updates configuration
   */
  updateConfig(newConfig: Partial<AdModeratorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Gets image type from filename or MIME type
   */
  private getImageType(filename?: string, mimeType?: string): string {
    if (mimeType) {
      const typeMap: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif'
      };
      return typeMap[mimeType] || 'jpg';
    }

    if (filename) {
      const extension = filename.split('.').pop()?.toLowerCase();
      return extension || 'jpg';
    }

    return 'jpg'; // Default fallback
  }

  /**
   * Disposes of resources
   */
  dispose(): void {
    this.modelManager.dispose();
    this.isInitialized = false;
  }
}
