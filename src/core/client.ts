import { Anthropic } from "@anthropic-ai/sdk";
import { AdStatus, AdModerationOptions, ImageDescription } from "./types";
import { ANTHROPIC_MODEL, DEFAULT_AD_FLAGS, generateImageDescriptionPrompt } from "./config";

export class AdModeratorClient {
    private readonly anthropic: Anthropic;
    constructor(private readonly apiKey: string) {
        this.anthropic = new Anthropic({
            apiKey: this.apiKey
        });
    }

    // return the ad status based on the image description
    public async getAdStatus(adImageBuffer: Buffer, options?: AdModerationOptions): Promise<AdStatus | undefined> {
        try {
            let flags: string[];
            
            if (options?.useOnlyCustomFlags && options?.customFlags) {
                flags = options.customFlags;
            } else if (options?.customFlags) {
                flags = [...DEFAULT_AD_FLAGS, ...options.customFlags];
            } else {
                flags = DEFAULT_AD_FLAGS;
            }
            
            const imageDescription = await this.describeAdImage(adImageBuffer, flags);
            if (!imageDescription) {
                throw new Error("Failed to describe ad image");
            }
            console.log(imageDescription);
            const sanitizedDescription = this.sanitizeJsonResponse(imageDescription);
            const imageDescriptionJson: ImageDescription = JSON.parse(sanitizedDescription);
            return this.checkAdStatus(imageDescriptionJson);
        } catch (error) {
            console.error(error);
            return;
        }
    }

    // sanitizes the response from Claude by removing markdown code blocks
    private sanitizeJsonResponse(response: string): string {
        let sanitized = response.trim();
        
        if (sanitized.startsWith('```json')) {
            sanitized = sanitized.substring(7).trim();
        } else if (sanitized.startsWith('```')) {
            sanitized = sanitized.substring(3).trim();
        }
        
        if (sanitized.endsWith('```')) {
            sanitized = sanitized.substring(0, sanitized.length - 3).trim();
        }
        
        return sanitized;
    }

    private async checkAdStatus(imageDescription: ImageDescription): Promise<AdStatus | undefined> {
        try {
            const adFlags = imageDescription.adFlags;
            const trueResults: string[] = Object.entries(adFlags)
                .filter(([key, value]) => value === true)
                .map(([key]) => key);
            
            const isAdCompliant = trueResults.length === 0;
            
            const result: AdStatus = {
                isAdCompliant
            };
            
            if (trueResults.length > 0) {
                result.negativeReasons = trueResults;
            }
            
            return result;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    // detects image format from buffer
    private detectImageFormat(buffer: Buffer): "image/jpeg" | "image/png" | "image/webp" {
        // png sig: 89 50 4E 47 0D 0A 1A 0A
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            return "image/png";
        }
        // jpeg sig: FF D8 FF
        else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            return "image/jpeg";
        }
        // webp sig: 52 49 46 46 (RIFF) followed by 57 45 42 50 (WEBP)
        else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
            buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
            return "image/webp";
        }
        return "image/png";
    }

    // analyzes the ad image and returns the image description
    private async describeAdImage(adImageBuffer: Buffer, flags: string[]): Promise<string | undefined> {
        try {
            const prompt = generateImageDescriptionPrompt(flags);
            const mediaType = this.detectImageFormat(adImageBuffer);
            const response = await this.anthropic.beta.messages.create({
                model: ANTHROPIC_MODEL,
                max_tokens: 1024,
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: prompt
                      },
                      {
                        type: "image",
                        source: {
                          type: "base64",
                          media_type: mediaType,
                          data: adImageBuffer.toString('base64')
                        }
                      }
                    ]
                  }
                ],
                betas: ["files-api-2025-04-14"],
              });
            const contentBlock = response.content[0];
            if (contentBlock && contentBlock.type === 'text') {
                return contentBlock.text;
            }
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    }

}