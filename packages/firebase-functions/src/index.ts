/**
 * Firebase Functions for Ad Moderator
 * Deploy with: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createAdModerator, FunctionAnalyzer } from 'ad-moderator';

// Initialize Firebase Admin
admin.initializeApp();

// Your analysis function - replace with your actual implementation
async function analyzeImage(
  imageBuffer: Buffer,
  imageType: string,
  options: any
): Promise<any[]> {
  const categories: any[] = [];
  
  try {
    // Example: Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image for inappropriate content for advertising. 
                     Return JSON format: {"categories": [{"name": "category", "confidence": 0.8, "severity": "high"}]}`
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: `image/${imageType}`,
                data: imageBuffer.toString('base64')
              }
            }
          ]
        }]
      })
    });

    const result = await response.json();
    
    if (result.content && result.content[0] && result.content[0].text) {
      const analysis = JSON.parse(result.content[0].text);
      if (analysis.categories) {
        analysis.categories.forEach((cat: any) => {
          categories.push({
            name: cat.name,
            confidence: cat.confidence,
            severity: cat.severity || 'medium'
          });
        });
      }
    }

  } catch (error) {
    console.error('Analysis error:', error);
    // Fallback: mark as potentially unsafe
    categories.push({
      name: 'analysis_error',
      confidence: 0.5,
      severity: 'medium'
    });
  }

  return categories;
}

// Initialize moderator
const moderator = createAdModerator({
  debug: false,
  defaultOptions: {
    threshold: 0.7,
    categories: ['explicit', 'violence', 'inappropriate', 'adult_content'],
    includeMetadata: true
  }
});

const analyzer = new FunctionAnalyzer('firebase-analyzer', analyzeImage);
moderator.setAnalyzer(analyzer);

// Initialize once
let isInitialized = false;
async function ensureInitialized() {
  if (!isInitialized) {
    await moderator.initialize();
    isInitialized = true;
  }
}

// HTTP Function for image moderation
export const moderateImage = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await ensureInitialized();

    const { imageData, imageType, options = {} } = req.body;

    if (!imageData) {
      res.status(400).json({ error: 'imageData is required' });
      return;
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData, 'base64');

    // Moderate image
    const result = await moderator.moderateImage({
      buffer: imageBuffer,
      filename: `image.${imageType}`,
      mimeType: `image/${imageType}`
    }, options);

    res.json({
      success: true,
      result: {
        isSafe: result.isSafe,
        confidence: result.confidence,
        flaggedCategories: result.flaggedCategories,
        metadata: result.metadata
      }
    });

  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Callable Function (for client SDKs)
export const moderateImageCallable = functions.https.onCall(async (data, context) => {
  try {
    await ensureInitialized();

    const { imageData, imageType, options = {} } = data;

    if (!imageData) {
      throw new functions.https.HttpsError('invalid-argument', 'imageData is required');
    }

    const imageBuffer = Buffer.from(imageData, 'base64');

    const result = await moderator.moderateImage({
      buffer: imageBuffer,
      filename: `image.${imageType}`,
      mimeType: `image/${imageType}`
    }, options);

    return {
      success: true,
      result: {
        isSafe: result.isSafe,
        confidence: result.confidence,
        flaggedCategories: result.flaggedCategories,
        metadata: result.metadata
      }
    };

  } catch (error) {
    console.error('Moderation error:', error);
    throw new functions.https.HttpsError('internal', 
      error instanceof Error ? error.message : 'Unknown error');
  }
});

// Batch processing function
export const moderateImagesBatch = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await ensureInitialized();

    const { images, options = {} } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      res.status(400).json({ error: 'images array is required' });
      return;
    }

    // Process images
    const imageInputs = images.map((img: any) => ({
      buffer: Buffer.from(img.imageData, 'base64'),
      filename: `image.${img.imageType}`,
      mimeType: `image/${img.imageType}`
    }));

    const results = await moderator.moderateImages(imageInputs, options);

    res.json({
      success: true,
      results: results.map(result => ({
        isSafe: result.isSafe,
        confidence: result.confidence,
        flaggedCategories: result.flaggedCategories,
        metadata: result.metadata
      }))
    });

  } catch (error) {
    console.error('Batch moderation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
