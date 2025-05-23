import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL, PROMPT_TEMPLATES } from '../config/constants';
import { getRandomUnusedOption } from '../utils/selectionManager';
import type { EnhancedRandomizationResponse, TitleAndKeywordsResponse, GeneratedPrompt } from '../types';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

export async function generateTitleAndKeywords(promptText: string): Promise<TitleAndKeywordsResponse | null> {
  try {
    const prompt = `Given this texture prompt: "${promptText}"\n\n${PROMPT_TEMPLATES.TITLE_AND_KEYWORDS}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const cleanJson = text.replace(/```json\n|\n```|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    
    return {
      title: parsed.title.replace(/[.,;:!?]/g, '').replace(/\s+/g, ' ').trim().slice(0, 70),
      keywords: parsed.keywords.split(',').map((k: string) => k.trim()).slice(0, 49).join(', ')
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}

export async function getEnhancedRandomization(
  materials: string[],
  primaryColors: string[],
  secondaryColors: string[],
  lightingStyles: string[],
  history: GeneratedPrompt[]
): Promise<EnhancedRandomizationResponse> {
  try {
    const materialType = getRandomUnusedOption(history, materials, 'materialType');
    const primaryColorTone = getRandomUnusedOption(history, primaryColors, 'primaryColorTone');
    const secondaryColorTone = getRandomUnusedOption(history, secondaryColors, 'secondaryColorTone');
    const lightingStyle = getRandomUnusedOption(history, lightingStyles, 'lightingStyle');

    const prompt = `${PROMPT_TEMPLATES.ENHANCED_RANDOMIZATION}

Selected options:
Material: ${materialType}
Primary Color: ${primaryColorTone}
Secondary Color: ${secondaryColorTone}
Lighting: ${lightingStyle}

Validate and confirm these selections work well together aesthetically.
If they do, return them as JSON. If not, suggest alternative combinations from the provided lists.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        materialType,
        primaryColorTone,
        secondaryColorTone,
        lightingStyle
      };
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.materialType || !parsed.primaryColorTone || 
        !parsed.secondaryColorTone || !parsed.lightingStyle ||
        !materials.includes(parsed.materialType) ||
        !primaryColors.includes(parsed.primaryColorTone) ||
        !secondaryColors.includes(parsed.secondaryColorTone) ||
        !lightingStyles.includes(parsed.lightingStyle)) {
      return {
        materialType,
        primaryColorTone,
        secondaryColorTone,
        lightingStyle
      };
    }

    return parsed;
  } catch (error) {
    console.error('Enhanced randomization failed:', error);
    return {
      materialType: getRandomUnusedOption(history, materials, 'materialType'),
      primaryColorTone: getRandomUnusedOption(history, primaryColors, 'primaryColorTone'),
      secondaryColorTone: getRandomUnusedOption(history, secondaryColors, 'secondaryColorTone'),
      lightingStyle: getRandomUnusedOption(history, lightingStyles, 'lightingStyle')
    };
  }
}