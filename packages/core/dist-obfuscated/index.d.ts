export { AdModerator } from './core/AdModerator';
export { AdModeratorClient, createAdModeratorClient } from './core/AdModeratorClient';
export { ImageProcessor } from './core/ImageProcessor';
export { ModelManager } from './core/ModelManager';
export { ImageAnalyzer, BaseImageAnalyzer, FunctionAnalyzer } from './analyzers/ImageAnalyzer';
export { SimpleAnalyzer } from './analyzers/SimpleAnalyzer';
export * from './types';
export declare const DEFAULT_CONFIG: {
    readonly defaultOptions: {
        readonly threshold: 0.5;
        readonly categories: readonly ["explicit", "violence", "inappropriate", "adult_content"];
        readonly includeMetadata: true;
    };
    readonly model: {
        readonly name: "ad-moderation";
        readonly version: "1.0.0";
        readonly inputSize: {
            readonly width: 224;
            readonly height: 224;
        };
        readonly channels: 3;
        readonly categories: readonly ["explicit", "violence", "inappropriate", "adult_content", "hate_speech"];
    };
    readonly debug: false;
};
export declare function createAdModerator(config?: Partial<typeof DEFAULT_CONFIG>): any;
export declare const VERSION = "1.0.0";
