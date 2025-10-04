export const ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";

export const DEFAULT_AD_FLAGS = [
    "Tobacco and related products",
    "Illegal drugs and controlled substances",
    "Prescription or controlled medications",
    "Counterfeit or imitation goods",
    "Weapons and ammunition",
    "Gambling and betting",
    "Adult or sexual content",
    "Alcohol",
    "Cryptocurrencies and high-risk financial products",
    "Extremist, political, or religious propaganda",
    "Violent or graphic content",
    "Predatory or short-term lending",
    "Discriminatory or hateful content",
    "Hacking or malicious software",
    "Miracle or pseudoscientific products",
    "Data sales or surveillance services",
    "Illegal or unregulated services"
];

export function generateImageDescriptionPrompt(flags: string[]): string {
    const flagsList = flags.map(flag => `    ${flag}`).join('\n');
    const flagsJson = flags.map(flag => `        "${flag}": boolean`).join(',\n');
    
    return `You are an expert image description specialist tasked with creating comprehensive, objective descriptions for content moderation purposes.

Please analyze the attached image and provide a complete, detailed description following these guidelines:

CORE REQUIREMENTS:
- Describe everything visible in the image with precision and objectivity
- Use clear, unambiguous language
- Be thorough enough that the image could be recreated from your description alone

STRUCTURE YOUR DESCRIPTION TO INCLUDE:

1. OVERALL SCENE:
   - Image type (photo, illustration, screenshot, meme, etc.)
   - Setting/environment (indoor, outdoor, abstract, etc.)
   - General composition and layout

2. SUBJECTS & PEOPLE:
   - Number of people and their apparent demographics (age range, gender presentation)
   - Clothing and appearance details
   - Poses, activities, and interactions
   - Facial expressions and gestures

3. OBJECTS & ELEMENTS:
   - All visible objects, props, and items
   - Text content (transcribe all visible text, logos, signs)
   - Symbols, brands, or recognizable marks

4. VISUAL DETAILS:
   - Colors, lighting, and atmosphere
   - Style and artistic approach
   - Image quality and technical aspects

5. AD FLAGS:
    You are to describe any of these flags in the image in specific detail, if present.
${flagsList}

IMPORTANT MODERATION CONSIDERATIONS:
- DO NOT censor or soften descriptions of potentially violating content
- Flag any ambiguous elements that might require human review
- Mention brand names, copyrighted characters, or IP explicitly

Your description should be factual and complete.

FORMATTING INSTRUCTIONS:
- Strictly adhere to the JSON format.
- All values should be boolean - and return false if not present.
- Use the following format:
{
    "imageDescription": "string",
    "adFlags": {
${flagsJson}
    }
}
`;
}