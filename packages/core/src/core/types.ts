export interface AdStatus {
    isAdCompliant: boolean;
    negativeReasons?: string[];
}

export interface AdModerationOptions {
    customFlags?: string[];
    useOnlyCustomFlags?: boolean;
}

export interface ImageDescription {
    imageDescription: string;
    adFlags: {
        [key: string]: boolean;
    };
}

