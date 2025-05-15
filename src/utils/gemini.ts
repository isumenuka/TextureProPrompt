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
      Materials: ${JSON.stringify(materials.slice(0, 10))}... (full list available)
      Primary Colors: ${JSON.stringify(primaryColorTones.slice(0, 10))}... (full list available)
      Secondary Colors: ${JSON.stringify(secondaryColorTones.slice(0, 10))}... (full list available)
      Lighting: ${JSON.stringify(lightingStyles.slice(0, 10))}... (full list available)

      Return only a JSON object with these exact keys: materialType, primaryColorTone, secondaryColorTone, lightingStyle.
      Values must exactly match items from the provided lists.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanJson = text.replace(/```json\n|\n```|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Validate all returned values
      if (!materials.includes(parsed.materialType) ||
          !primaryColorTones.includes(parsed.primaryColorTone) ||
          !secondaryColorTones.includes(parsed.secondaryColorTone) ||
          !lightingStyles.includes(parsed.lightingStyle)) {
        throw new Error('Invalid values returned from AI');
      }

      return parsed;
    } catch (e) {
      console.error('AI response validation failed:', e);
      // Fallback to pure random selection
      return {
        materialType: randomMaterial,
        primaryColorTone: randomPrimary,
        secondaryColorTone: randomSecondary,
        lightingStyle: randomLighting
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to pure random selection
    return {
      materialType: getRandomElement(materials),
      primaryColorTone: getRandomElement(primaryColorTones),
      secondaryColorTone: getRandomElement(secondaryColorTones),
      lightingStyle: getRandomElement(lightingStyles)
    };
  }
}