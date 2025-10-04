import { ModelConfig, ModerationCategory, ModerationOptions } from '../types';
import { ImageAnalyzer } from '../analyzers/ImageAnalyzer';
export declare class ModelManager {
    private analyzer;
    private config;
    constructor(config: ModelConfig);
    setAnalyzer(analyzer: ImageAnalyzer): void;
    loadModel(modelPath?: string): Promise<void>;
    predict(imageBuffer: Buffer, imageType: string, options?: ModerationOptions): Promise<ModerationCategory[]>;
    dispose(): void;
}
