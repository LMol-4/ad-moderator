import { AdModeratorConfig, ModerationOptions, ImageInput, ModerationResult } from '../types';
export declare class AdModeratorClient {
    private moderator;
    private isInitialized;
    constructor(config?: Partial<AdModeratorConfig>);
    initialize(): Promise<void>;
    setAnalysisFunction(analysisFunction: (imageBuffer: Buffer, imageType: string, options: ModerationOptions) => Promise<any[]>): void;
    setFirebaseFunction(firebaseFunctionUrl: string, apiKey?: string): void;
    moderateImage(image: ImageInput, options?: Partial<ModerationOptions>): Promise<ModerationResult>;
    moderateImages(images: ImageInput[], options?: Partial<ModerationOptions>): Promise<ModerationResult[]>;
    isImageSafe(image: ImageInput, options?: Partial<ModerationOptions>): Promise<boolean>;
    getStats(): {
        isInitialized: boolean;
        version: string;
    };
    dispose(): void;
}
export declare function createAdModeratorClient(config?: Partial<AdModeratorConfig>): AdModeratorClient;
