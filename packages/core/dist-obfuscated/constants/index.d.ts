export declare const DEFAULT_CATEGORIES: readonly ["explicit", "violence", "inappropriate", "adult_content", "hate_speech", "drugs", "weapons", "gore", "nudity", "sexual_content"];
export declare const SEVERITY_LEVELS: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
    readonly CRITICAL: "critical";
};
export declare const SUPPORTED_IMAGE_FORMATS: readonly ["image/jpeg", "image/png", "image/webp", "image/gif"];
export declare const MAX_IMAGE_SIZE: number;
export declare const MIN_IMAGE_SIZE = 1024;
export declare const DEFAULT_CLAUDE_CONFIG: {
    readonly baseUrl: "https://api.anthropic.com/v1";
    readonly model: "claude-3-sonnet-20240229";
    readonly maxTokens: 1000;
    readonly timeout: 30000;
    readonly debug: false;
};
export declare const DEFAULT_MODERATION_OPTIONS: {
    readonly threshold: 0.5;
    readonly includeMetadata: true;
};
export declare const ERROR_MESSAGES: {
    readonly NOT_INITIALIZED: "Ad Moderator not initialized. Call initialize() first.";
    readonly MODEL_NOT_LOADED: "Model not loaded. Call loadModel() first.";
    readonly INVALID_IMAGE: "Invalid image provided";
    readonly IMAGE_TOO_LARGE: "Image too large";
    readonly UNSUPPORTED_FORMAT: "Unsupported image format";
    readonly PROCESSING_FAILED: "Image processing failed";
    readonly PREDICTION_FAILED: "Prediction failed";
    readonly VALIDATION_FAILED: "Validation failed";
};
export declare const VERSION = "1.0.0";
export declare const LIBRARY_NAME = "ad-moderator";
