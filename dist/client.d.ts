import { AdStatus, AdMediaType } from "./types";
export declare class AdModeratorClient {
    private readonly apiKey;
    private readonly anthropic;
    constructor(apiKey: string);
    getAdStatus(adImageBuffer: Buffer, adMediaType: AdMediaType): Promise<AdStatus | undefined>;
    private sanitizeJsonResponse;
    private checkAdStatus;
    private describeAdImage;
    private uploadAdImage;
}
//# sourceMappingURL=client.d.ts.map