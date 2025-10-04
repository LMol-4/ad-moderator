import { ImageInput, ModerationMetadata } from '../types';
export declare class ImageProcessor {
    static processImage(input: ImageInput, targetSize: {
        width: number;
        height: number;
    }, channels?: number): Promise<{
        processedBuffer: Buffer;
        metadata: ModerationMetadata;
    }>;
    static validateImage(input: ImageInput): {
        isValid: boolean;
        error?: string;
    };
}
