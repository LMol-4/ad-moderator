import { BaseImageAnalyzer } from './ImageAnalyzer';
import { ModerationCategory, ModerationOptions } from '../types';

/**
 * Simple example analyzer that demonstrates how to create a custom analyzer
 */
export class SimpleAnalyzer extends BaseImageAnalyzer {
  constructor() {
    super('simple-analyzer', '1.0.0');
  }

  async analyze(
    imageBuffer: Buffer,
    imageType: string,
    options: ModerationOptions
  ): Promise<ModerationCategory[]> {
    // This is just an example - replace with your actual analysis logic
    const categories: ModerationCategory[] = [];
    
    // Example: Check file size (larger files might be more likely to contain inappropriate content)
    const fileSize = imageBuffer.length;
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (fileSize > maxSize) {
      categories.push({
        name: 'large_file',
        confidence: 0.3,
        severity: 'low'
      });
    }

    // Example: Check image type
    if (imageType === 'gif') {
      categories.push({
        name: 'animated_content',
        confidence: 0.2,
        severity: 'low'
      });
    }

    // Example: Random analysis (replace with real logic)
    const random = Math.random();
    if (random > 0.8) {
      categories.push({
        name: 'potentially_inappropriate',
        confidence: random,
        severity: random > 0.9 ? 'high' : 'medium'
      });
    }

    // Filter by threshold
    const threshold = options.threshold || 0.5;
    return categories.filter(cat => cat.confidence >= threshold);
  }
}
