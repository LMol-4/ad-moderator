import { BaseImageAnalyzer } from './ImageAnalyzer';
import { ModerationCategory, ModerationOptions } from '../types';
export declare class SimpleAnalyzer extends BaseImageAnalyzer {
    constructor();
    analyze(imageBuffer: Buffer, imageType: string, options: ModerationOptions): Promise<ModerationCategory[]>;
}
