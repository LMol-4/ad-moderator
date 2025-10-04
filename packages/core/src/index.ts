/**
 * Ad Moderator - A TypeScript library for detecting images not eligible for public ad spaces
 * 
 * This library uses machine learning to automatically moderate images and determine
 * if they are safe for use in public advertising spaces.
 */

export { AdModeratorClient } from './core/client';
export { AdStatus, AdMediaType, ImageDescription } from './core/types';

// Version information
export const VERSION = '1.0.3';