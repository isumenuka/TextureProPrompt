import { GoogleGenerativeAI } from "@google/generative-ai";
import { materials } from '../data/materials';
import { primaryColorTones, secondaryColorTones } from '../data/colorTones';
import { lightingStyles } from '../data/lightingStyles';
import { getRandomElement } from './random';

const genAI = new GoogleGenerativeAI("AIzaSyBoY5bDBg5lM9TGXxYR3N64lR1CYUbkIIw");

export async function getEnhancedRandomization(currentPrompt: {
  materialType?: string;
  primaryColorTone?: string;
  secondaryColorTone?: string;
  lightingStyle?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Initial random selection as fallback and reference
    const randomMaterial = getRandomElement(materials);
    const randomPrimary = getRandomElement(primaryColorTones);
    const randomSecondary = getRandomElement(secondaryColorTones);
    const randomLighting = getRandomElement(lightingStyles);

    const fallbackSelection = {
      materialType: randomMaterial,
      primaryColorTone: randomPrimary,
      secondaryColorTone: randomSecondary,
      lightingStyle: randomLighting
    };

    const prompt = `Create a visually harmonious texture combination.
      Current selection (for reference only):
      Material: ${currentPrompt.materialType || randomMaterial}
      Primary Color: ${currentPrompt.primaryColorTone || randomPrimary}
      Secondary Color: ${currentPrompt.secondaryColorTone || randomSecondary}
      Lighting: ${currentPrompt.lightingStyle || randomLighting}

      Create a NEW combination that would work well together, considering:
      - Material and color compatibility
      - Lighting that enhances the material's characteristics
      - Complementary color combinations
      
      Select EXACTLY ONE item from each of these lists:
      Materials: ${JSON.stringify(materials)}
      Primary Colors: ${JSON.stringify(primaryColorTones)}
      Secondary Colors: ${JSON.stringify(secondaryColorTones)}
      Lighting: ${JSON.stringify(lightingStyles)}

      Return only a JSON object with these exact keys: materialType, primaryColorTone, secondaryColorTone, lightingStyle.
      All fields are required. Values must exactly match items from the provided lists.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanJson = text.replace(/```json\n|\n```|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Validate that all required fields are present and valid
      if (!parsed.materialType || !parsed.primaryColorTone || 
          !parsed.secondaryColorTone || !parsed.lightingStyle ||
          !materials.includes(parsed.materialType) ||
          !primaryColorTones.includes(parsed.primaryColorTone) ||
          !secondaryColorTones.includes(parsed.secondaryColorTone) ||
          !lightingStyles.includes(parsed.lightingStyle)) {
        console.warn('Invalid or missing values in AI response, using fallback');
        return fallbackSelection;
      }

      return parsed;
    } catch (e) {
      console.error('AI response parsing failed:', e);
      return fallbackSelection;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      materialType: getRandomElement(materials),
      primaryColorTone: getRandomElement(primaryColorTones),
      secondaryColorTone: getRandomElement(secondaryColorTones),
      lightingStyle: getRandomElement(lightingStyles)
    };
  }
}