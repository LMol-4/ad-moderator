import { ImageInput, ModerationOptions, AdModeratorConfig } from '../types';
export declare class ValidationError extends Error {
    field?: string | undefined;
    constructor(message: string, field?: string | undefined);
}
export declare class Validator {
    static validateImageInput(input: ImageInput): void;
    static validateModerationOptions(options: ModerationOptions): void;
    static validateAdModeratorConfig(config: AdModeratorConfig): void;
    static validateCategoriesAvailable(requestedCategories: string[], availableCategories: string[]): void;
}
