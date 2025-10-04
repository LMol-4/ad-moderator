import { Anthropic } from "@anthropic-ai/sdk";
import { AdStatus, AdModerationOptions, ImageDescription } from "./types";
import { ANTHROPIC_MODEL, DEFAULT_AD_FLAGS, generateImageDescriptionPrompt } from "./config";
import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export class AdModeratorClient {
    private readonly anthropic: Anthropic;
    constructor(private readonly apiKey: string) {
        this.anthropic = new Anthropic({
            apiKey: this.apiKey
        });
    }

    public async getVideoAdStatus(adVideoBuffer: Buffer, options?: AdModerationOptions): Promise<AdStatus | undefined> {
        try {
            // tmp directory
            const tmpDir = os.tmpdir();
            const videoDir = path.join(tmpDir, 'video-analysis');
            const screenshotsDir = path.join(videoDir, 'screenshots');
            
            if (!fs.existsSync(videoDir)) {
                fs.mkdirSync(videoDir, { recursive: true });
            }
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const videoPath = path.join(videoDir, 'input-video.mp4');
            fs.writeFileSync(videoPath, adVideoBuffer);

            const duration = await this.getVideoDuration(videoPath);
            await this.extractScreenshots(videoPath, screenshotsDir, duration);

            const screenshotFiles = fs.readdirSync(screenshotsDir)
                .filter(file => file.endsWith('.png'))
                .map(file => path.join(screenshotsDir, file));

            const screenshotResults = await Promise.all(
                screenshotFiles.map(async (screenshotPath) => {
                    const screenshotBuffer = fs.readFileSync(screenshotPath);
                    return await this.getAdStatus(screenshotBuffer, options);
                })
            );

            this.cleanupTempFiles(videoDir);

            const failedResults = screenshotResults.filter(result => result && !result.isAdCompliant);
            
            if (failedResults.length > 0) {
                const allNegativeReasons = failedResults
                    .flatMap(result => result?.negativeReasons || [])
                    .filter((reason, index, array) => array.indexOf(reason) === index); // remove duplicates

                return {
                    isAdCompliant: false,
                    negativeReasons: allNegativeReasons
                };
            }

            return { isAdCompliant: true };

        } catch (error) {
            console.error('Error analyzing video:', error);
            return undefined;
        }
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

    private async getVideoDuration(videoPath: string): Promise<number> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err: any, metadata: any) => {
                if (err) {
                    reject(new Error(`Failed to get video duration: ${err.message}`));
                    return;
                }
                const duration = metadata.format.duration;
                if (!duration) {
                    reject(new Error('Could not determine video duration'));
                    return;
                }
                resolve(duration);
            });
        });
    }

    // screenshots every 0.5 seconds
    private async extractScreenshots(videoPath: string, outputDir: string, duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            // Generate timemarks every 0.5 seconds
            const timemarks: string[] = [];
            for (let i = 0; i < duration; i += 0.5) {
                timemarks.push(i.toFixed(1));
            }

            ffmpeg(videoPath)
                .on('filenames', (filenames: string[]) => {
                    console.log(`Will generate ${filenames.length} screenshots: ${filenames.join(', ')}`);
                })
                .on('end', () => {
                    console.log('Screenshots extracted successfully');
                    resolve();
                })
                .on('error', (err: any) => {
                    reject(new Error(`Failed to extract screenshots: ${err.message}`));
                })
                .screenshots({
                    timemarks: timemarks,
                    filename: 'screenshot-at-%s-seconds.png',
                    folder: outputDir,
                    size: '320x240' // small size for faster processing
                });
        });
    }

    private cleanupTempFiles(dirPath: string): void {
        try {
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
                console.log('Temporary files cleaned up');
            }
        } catch (error) {
            console.error('Error cleaning up temporary files:', error);
        }
    }

}