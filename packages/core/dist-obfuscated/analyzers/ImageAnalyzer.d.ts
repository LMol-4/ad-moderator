import { ModerationCategory, ModerationOptions } from '../types';
export interface ImageAnalyzer {
    analyze(imageBuffer: Buffer, imageType: string, options: ModerationOptions): Promise<ModerationCategory[]>;
}
export declare abstract class BaseImageAnalyzer implements ImageAnalyzer {
    protected name: string;
    protected version: string;
    constructor(name: string, version?: string);
    abstract analyze(imageBuffer: Buffer, imageType: string, options: ModerationOptions): Promise<ModerationCategory[]>;
    getName(): string;
    getVersion(): string;
}
export declare class FunctionAnalyzer extends BaseImageAnalyzer {
    private analyzeFunction;
    constructor(name: string, analyzeFunction: (imageBuffer: Buffer, imageType: string, options: ModerationOptions) => Promise<ModerationCategory[]>, version?: string);
    analyze(imageBuffer: Buffer, imageType: string, options: ModerationOptions): Promise<ModerationCategory[]>;
}
