# Ad Moderator

A simple TypeScript library for detecting images and videos not suitable for public advertising using Claude AI.

## Installation

```bash
npm install ad-moderator
```

## Usage

```typescript
import { AdModeratorClient } from 'ad-moderator';

const client = new AdModeratorClient('your-anthropic-api-key');

const imageBuffer = Buffer.from('your-image-data');
const result = await client.getAdStatus(imageBuffer);

if (result?.isAdCompliant) {
  console.log('Image is safe for advertising');
} else {
  console.log('Image is not safe for advertising');
  console.log('Reasons:', result?.negativeReasons);
}

const videoBuffer = Buffer.from('your-video-data');
const videoResult = await client.getVideoAdStatus(videoBuffer);

if (videoResult?.isAdCompliant) {
  console.log('Video is safe for advertising');
} else {
  console.log('Video is not safe for advertising');
  console.log('Reasons:', videoResult?.negativeReasons);
}
```

```typescript
// With appended customs flags
const customResult = await client.getAdStatus(imageBuffer, {
  customFlags: [
    'Adult or sexual content',
    'Violent or graphic content',
    'Illegal drugs and controlled substances'
  ]
});

// With only custom flags
const overrideResult = await client.getAdStatus(imageBuffer, {
  customFlags: [
    'Adult or sexual content',
    'Violent or graphic content'
  ],
  useOnlyCustomFlags: true
});
```

## How Video Moderation Works

The video moderation feature works by:

1. **Extracting Screenshots**: The video is processed using FFmpeg to extract screenshots every 0.5 seconds
2. **Image Analysis**: Each screenshot is analyzed using the same image moderation logic
3. **Aggregated Results**: If any screenshot fails moderation, the entire video is marked as non-compliant
4. **Cleanup**: Temporary files are automatically cleaned up after processing

**Note**: Video processing requires FFmpeg to be installed on your system. The library extracts screenshots at 320x240 resolution for faster processing.

## API

### AdModeratorClient

- `new AdModeratorClient(apiKey: string)` - Initialize with your Anthropic API key
- `getAdStatus(imageBuffer: Buffer, options?: AdModerationOptions)` - Check image compliance
- `getVideoAdStatus(videoBuffer: Buffer, options?: AdModerationOptions)` - Check video compliance by analyzing screenshots

### Types

```typescript
interface AdStatus {
  isAdCompliant: boolean;
  negativeReasons?: string[];
}

interface AdModerationOptions {
  customFlags?: string[];
  useOnlyCustomFlags?: boolean;
}
```