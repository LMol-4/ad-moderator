import { ImageAnalyzer } from '../analyzers/ImageAnalyzer';
import { ImageInput, ModerationResult, ModerationOptions, AdModeratorConfig } from '../types';
export declare class AdModerator {
    private modelManager;
    private config;
    private isInitialized;
    constructor(config: AdModeratorConfig);
    setAnalyzer(analyzer: ImageAnalyzer): void;
    initialize(): Promise<void>;
    moderateImage(input: ImageInput, options?: ModerationOptions): Promise<ModerationResult>;
    moderateImages(inputs: ImageInput[], options?: ModerationOptions): Promise<ModerationResult[]>;
    private calculateOverallConfidence;
    getConfig(): AdModeratorConfig;
    updateConfig(newConfig: Partial<AdModeratorConfig>): void;
    private getImageType;
    dispose(): void;
}
