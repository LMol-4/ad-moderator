"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdModerator = testAdModerator;
exports.createTestImageDirectory = createTestImageDirectory;
const client_1 = require("./client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
// Test script for AdModeratorClient
async function testAdModerator() {
    // Get API key from environment variables
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    // Initialize the client
    const adModerator = new client_1.AdModeratorClient(API_KEY);
    console.log('🚀 Starting Ad Moderator Test...\n');
    try {
        // Test with a sample image file
        const testImagePath = path_1.default.join(__dirname, '..', 'test-images', 'sample-ad.png');
        // Check if test image exists
        if (!fs_1.default.existsSync(testImagePath)) {
            console.log('⚠️  Test image not found!');
            console.log('📝 To test with a real image:');
            console.log('   1. Create a "test-images" folder in your project root');
            console.log('   2. Add a sample ad image named "sample-ad.png"');
            console.log('   3. Run this script again\n');
            return;
        }
        // Read the image file
        const imageBuffer = fs_1.default.readFileSync(testImagePath);
        console.log(`📸 Testing with image: ${testImagePath}`);
        console.log(`📊 Image size: ${imageBuffer.length} bytes\n`);
        // Test with digital media type
        console.log('🔍 Testing with digital media type...');
        const digitalResult = await adModerator.getAdStatus(imageBuffer, 'digital');
        console.log('📋 Digital Media Result:', JSON.stringify(digitalResult, null, 2));
        console.log('');
    }
    catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}
// Helper function to create test image directory
function createTestImageDirectory() {
    const testDir = path_1.default.join(__dirname, '..', 'test-images');
    if (!fs_1.default.existsSync(testDir)) {
        fs_1.default.mkdirSync(testDir, { recursive: true });
        console.log('📁 Created test-images directory');
    }
}
// Main execution
async function main() {
    console.log('🎯 Ad Moderator Test Suite');
    console.log('==========================\n');
    // Create test directory
    createTestImageDirectory();
    // Run the test
    await testAdModerator();
    console.log('✅ Test completed!');
}
// Run the test if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=index.js.map