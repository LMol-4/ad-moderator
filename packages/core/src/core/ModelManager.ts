import { ModelConfig, ModerationCategory, ModerationOptions } from '../types';
import { ImageAnalyzer } from '../analyzers/ImageAnalyzer';
import { logger } from '../utils/logger';

/**
 * Manages image analysis using pluggable analyzers
 */
export class ModelManager {
  private analyzer: ImageAnalyzer | null = null;
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  /**
   * Sets the image analyzer to use
   */
  setAnalyzer(analyzer: ImageAnalyzer): void {
    this.analyzer = analyzer;
    const name = (analyzer as any).name || 'Unknown';
    const version = (analyzer as any).version || '1.0.0';
    logger.info(`Analyzer set: ${name} v${version}`);
  }

  /**
   * Initializes the analyzer (for compatibility)
   */
  async loadModel(modelPath?: string): Promise<void> {
    if (!this.analyzer) {
      throw new Error('No analyzer set. Call setAnalyzer() first.');
    }
    logger.info(`Model manager initialized: ${this.config?.name || 'Unknown'} v${this.config?.version || '1.0.0'}`);
  }

  /**
   * Performs image analysis using the configured analyzer
   */
  async predict(
    imageBuffer: Buffer,
    imageType: string,
    options: ModerationOptions = {}
  ): Promise<ModerationCategory[]> {
    if (!this.analyzer) {
      throw new Error('No analyzer configured. Call setAnalyzer() first.');
    }

    try {
      const name = (this.analyzer as any).name || 'Unknown';
      logger.debug(`Starting image analysis with ${name}`);
      
      // Use the configured analyzer to analyze the image
      const categories = await this.analyzer.analyze(
        imageBuffer,
        imageType,
        options
      );

      logger.debug(`Analysis completed: ${categories.length} categories flagged`);
      return categories;
    } catch (error) {
      logger.error('Image analysis failed:', error);
      throw new Error(`Image analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disposes of the analyzer
   */
  dispose(): void {
    this.analyzer = null;
  }
}
