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

    // analyzes the ad image and returns the image description
    private async describeAdImage(adImageBuffer: Buffer, flags: string[]): Promise<string | undefined> {
        try {
            const prompt = generateImageDescriptionPrompt(flags);
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
                          media_type: "image/png",
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