export interface AdStatus {
    isAdCompliant: boolean;
    negativeReasons?: string[];
}

export type AdMediaType = "digital" | "physical";

export interface ImageDescription {
    imageDescription: string;
    adFlags: {
        [key: string]: boolean;
    };
}