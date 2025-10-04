"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdModeratorClient = void 0;
const sdk_1 = require("@anthropic-ai/sdk");
const config_1 = require("./config");
class AdModeratorClient {
    apiKey;
    anthropic;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.anthropic = new sdk_1.Anthropic({
            apiKey: this.apiKey
        });
    }
    // return the ad status based on the image description
    async getAdStatus(adImageBuffer, adMediaType) {
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
            const imageDescriptionJson = JSON.parse(sanitizedDescription);
            return this.checkAdStatus(imageDescriptionJson);
        }
        catch (error) {
            console.error(error);
            return;
        }
    }
    // sanitizes the response from Claude by removing markdown code blocks
    sanitizeJsonResponse(response) {
        let sanitized = response.trim();
        if (sanitized.startsWith('```json')) {
            sanitized = sanitized.substring(7).trim();
        }
        else if (sanitized.startsWith('```')) {
            sanitized = sanitized.substring(3).trim();
        }
        if (sanitized.endsWith('```')) {
            sanitized = sanitized.substring(0, sanitized.length - 3).trim();
        }
        return sanitized;
    }
    async checkAdStatus(imageDescription) {
        try {
            const adFlags = imageDescription.adFlags;
            const trueResults = Object.entries(adFlags)
                .filter(([key, value]) => value === true)
                .map(([key]) => key);
            const isAdCompliant = trueResults.length === 0;
            const result = {
                isAdCompliant
            };
            if (trueResults.length > 0) {
                result.negativeReasons = trueResults;
            }
            return result;
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }
    // analyzes the ad image and returns the image description
    async describeAdImage(adImageBuffer, fileId) {
        try {
            const response = await this.anthropic.beta.messages.create({
                model: config_1.ANTHROPIC_MODEL,
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `${config_1.IMAGE_DESCRIPTION_PROMPT}`
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
        }
        catch (error) {
            console.error(error);
            return;
        }
    }
    // uploads the ad image to the anthropic api and returns the file id
    async uploadAdImage(adImageBuffer) {
        try {
            const response = await this.anthropic.beta.files.upload({
                file: await (0, sdk_1.toFile)(adImageBuffer, 'ad-image.png', { type: 'image/png' }),
                betas: ['files-api-2025-04-14']
            });
            return response.id;
        }
        catch (error) {
            console.error(error);
            return;
        }
    }
}
exports.AdModeratorClient = AdModeratorClient;
//# sourceMappingURL=client.js.map