export interface ModerationResult {
    isSafe: boolean;
    confidence: number;
    flaggedCategories: ModerationCategory[];
    metadata: ModerationMetadata;
}
export interface ModerationCategory {
    name: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface ModerationMetadata {
    processingTime: number;
    modelVersion: string;
    dimensions: {
        width: number;
        height: number;
    };
    fileSize: number;
    format: string;
}
export interface ModerationOptions {
    threshold?: number;
    categories?: string[];
    includeMetadata?: boolean;
    modelPath?: string;
}
export interface ImageInput {
    buffer: Buffer;
    filename?: string;
    mimeType?: string;
}
export interface ModelConfig {
    name: string;
    version: string;
    inputSize: {
        width: number;
        height: number;
    };
    channels: number;
    categories: string[];
}
export interface AdModeratorConfig {
    defaultOptions: ModerationOptions;
    model: ModelConfig;
    debug?: boolean;
}
