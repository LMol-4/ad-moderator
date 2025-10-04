import { Anthropic, toFile } from "@anthropic-ai/sdk";
import fs from "fs";
import { AdStatus } from "./types";
import { ANTHROPIC_MODEL, IMAGE_DESCRIPTION_PROMPT } from "./config";

class AdModeratorClient {
    private readonly anthropic: Anthropic;
    constructor(private readonly apiKey: string) {
        this.anthropic = new Anthropic({
            apiKey: this.apiKey
        });
    }

    // analyzes the ad image and returns the image description
    public async analyzeAdImage(adImageBuffer: Buffer, fileId: string): Promise<string | undefined> {
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
        } catch (error) {
            console.error(error);
            return;
        }
    }

    // uploads the ad image to the anthropic api and returns the file id
    private async uploadAdImage(adImageBuffer: Buffer): Promise<string | undefined> {
        try {
            const response = await this.anthropic.beta.files.upload({
                file: await toFile(fs.createReadStream(adImageBuffer), undefined, { type: 'image/png' }),
                betas: ['files-api-2025-04-14']
            });
            return response.id;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}