import { ModerationCategory, ModerationOptions } from '../types';

/**
 * Interface for image analyzers
 * This allows you to plug in any analysis function
 */
export interface ImageAnalyzer {
  /**
   * Analyzes an image and returns moderation categories
   */
  analyze(
    imageBuffer: Buffer,
    imageType: string,
    options: ModerationOptions
  ): Promise<ModerationCategory[]>;
}

/**
 * Base class for image analyzers
 */
export abstract class BaseImageAnalyzer implements ImageAnalyzer {
  protected name: string;
  protected version: string;

  constructor(name: string, version: string = '1.0.0') {
    this.name = name;
    this.version = version;
  }

  abstract analyze(
    imageBuffer: Buffer,
    imageType: string,
    options: ModerationOptions
  ): Promise<ModerationCategory[]>;

  getName(): string {
    return this.name;
  }

  getVersion(): string {
    return this.version;
  }
}

/**
 * Function-based analyzer - easiest way to plug in custom functions
 */
export class FunctionAnalyzer extends BaseImageAnalyzer {
  private analyzeFunction: (
    imageBuffer: Buffer,
    imageType: string,
    options: ModerationOptions
  ) => Promise<ModerationCategory[]>;

  constructor(
    name: string,
    analyzeFunction: (
      imageBuffer: Buffer,
      imageType: string,
      options: ModerationOptions
    ) => Promise<ModerationCategory[]>,
    version: string = '1.0.0'
  ) {
    super(name, version);
    this.analyzeFunction = analyzeFunction;
  }

  async analyze(
    imageBuffer: Buffer,
    imageType: string,
    options: ModerationOptions
  ): Promise<ModerationCategory[]> {
    return await this.analyzeFunction(imageBuffer, imageType, options);
  }
}
