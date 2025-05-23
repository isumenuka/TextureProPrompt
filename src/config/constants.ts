// API Configuration
export const GEMINI_API_KEY = "AIzaSyBoY5bDBg5lM9TGXxYR3N64lR1CYUbkIIw";
export const GEMINI_MODEL = "gemini-2.0-flash";

// Storage Keys
export const STORAGE_KEYS = {
  CUSTOM_PROMPT_HISTORY: 'texturepro-custom-prompt-history',
  GENERATED_PROMPT_HISTORY: 'texturepro-generated-prompt-history'
} as const;

// UI Constants
export const MAX_PROMPT_LENGTH = 500;
export const MAX_HISTORY_ITEMS = 10;
export const COPY_TIMEOUT = 2000;

// Prompt Generation
export const PROMPT_TEMPLATES = {
  TITLE_AND_KEYWORDS: `Create:
1. A title that:
   - Is factual and descriptive
   - Uses natural phrases
   - Focuses on material, color, and texture characteristics
   - Is 70 characters or less
   - Avoids keyword stuffing
   - Excludes brand names or artistic references
   
2. Generate EXACTLY 49 relevant keywords that:
   - Describe physical properties (material, texture, pattern)
   - Include surface characteristics
   - Specify visual qualities
   - Mention technical aspects
   - Cover design applications
   - Use specific, scientific terms where applicable
   - Are individual words or simple phrases
   - Avoid combined terms
   - Exclude copyrighted terms or brands
   
Return as JSON with format:
{
  "title": "concise natural phrase describing the texture",
  "keywords": "keyword1, keyword2, ..., keyword49"
}`,

  ENHANCED_RANDOMIZATION: `Select EXACTLY ONE item from each category to create a visually harmonious texture combination.
Return only a JSON object with these exact keys: materialType, primaryColorTone, secondaryColorTone, lightingStyle.
All values must exactly match items from the provided lists.`
} as const;