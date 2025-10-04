/**
 * Core types for the Ad Moderator library
 */

export interface ModerationResult {
  /** Whether the image is safe for public ad spaces */
  isSafe: boolean;
  /** Confidence score (0-1) for the moderation decision */
  confidence: number;
  /** Specific categories that were flagged */
  flaggedCategories: ModerationCategory[];
  /** Additional metadata about the analysis */
  metadata: ModerationMetadata;
}

export interface ModerationCategory {
  /** Category name (e.g., 'explicit', 'violence', 'inappropriate') */
  name: string;
  /** Confidence score for this specific category (0-1) */
  confidence: number;
  /** Severity level of the flagged content */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ModerationMetadata {
  /** Processing time in milliseconds */
  processingTime: number;
  /** Model version used for analysis */
  modelVersion: string;
  /** Image dimensions */
  dimensions: {
    width: number;
    height: number;
  };
  /** File size in bytes */
  fileSize: number;
  /** Image format */
  format: string;
}

export interface ModerationOptions {
  /** Minimum confidence threshold for flagging (0-1) */
  threshold?: number;
  /** Categories to check for */
  categories?: string[];
  /** Whether to return detailed metadata */
  includeMetadata?: boolean;
  /** Custom model path (if using local model) */
  modelPath?: string;
}

export interface ImageInput {
  /** Image buffer */
  buffer: Buffer;
  /** Optional filename for metadata */
  filename?: string;
  /** Optional MIME type */
  mimeType?: string;
}

export interface ModelConfig {
  /** Model name/identifier */
  name: string;
  /** Model version */
  version: string;
  /** Input image size expected by the model */
  inputSize: {
    width: number;
    height: number;
  };
  /** Number of channels (3 for RGB, 4 for RGBA) */
  channels: number;
  /** Categories this model can detect */
  categories: string[];
}

export interface AdModeratorConfig {
  /** Default moderation options */
  defaultOptions: ModerationOptions;
  /** Model configuration */
  model: ModelConfig;
  /** Whether to enable debug logging */
  debug?: boolean;
}
