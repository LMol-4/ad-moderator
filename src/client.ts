import { Anthropic, toFile } from "@anthropic-ai/sdk";
import fs from "fs";
import { AdStatus, AdMediaType, ImageDescription } from "./types";
import { ANTHROPIC_MODEL, IMAGE_DESCRIPTION_PROMPT } from "./config";

export class AdModeratorClient {
    private readonly anthropic: Anthropic;
    constructor(private readonly apiKey: string) {
        this.anthropic = new Anthropic({
            apiKey: this.apiKey
        });
    }

    // return the ad status based on the image description
    public async getAdStatus(adImageBuffer: Buffer, adMediaType: AdMediaType): Promise<AdStatus | undefined> {
        try {
            const fileId = await this.uploadAdImage(adImageBuffer);
            if (!fileId) {
                throw new Error("Failed to upload ad image");
            }
            const imageDescription = await this.describeAdImage(adImageBuffer, fileId);
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
    private async describeAdImage(adImageBuffer: Buffer, fileId: string): Promise<string | undefined> {
        try {
            const response = await this.anthropic.beta.messages.create({
                model: ANTHROPIC_MODEL,
                max_tokens: 1024,
                messages: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: `${IMAGE_DESCRIPTION_PROMPT}`
                      },
                      {
                        type: "image",
                        source: {
                          type: "file",
                          file_id: fileId
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

    // uploads the ad image to the anthropic api and returns the file id
    private async uploadAdImage(adImageBuffer: Buffer): Promise<string | undefined> {
        try {
            const response = await this.anthropic.beta.files.upload({
                file: await toFile(adImageBuffer, 'ad-image.png', { type: 'image/png' }),
                betas: ['files-api-2025-04-14']
            });
            return response.id;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}