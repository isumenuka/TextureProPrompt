import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBoY5bDBg5lM9TGXxYR3N64lR1CYUbkIIw");

export async function getEnhancedRandomization(currentPrompt: {
  materialType?: string;
  primaryColorTone?: string;
  secondaryColorTone?: string;
  lightingStyle?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Given these texture parameters:
      Material: ${currentPrompt.materialType || 'any'}
      Primary Color: ${currentPrompt.primaryColorTone || 'any'}
      Secondary Color: ${currentPrompt.secondaryColorTone || 'any'}
      Lighting: ${currentPrompt.lightingStyle || 'any'}

      Suggest a cohesive combination of texture parameters that would create a visually appealing and realistic texture. 
      Return ONLY a valid JSON object with these exact keys: materialType, primaryColorTone, secondaryColorTone, lightingStyle.
      Do not include any markdown formatting, code blocks, or additional text. The response should be a plain JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Remove any markdown code block formatting if present
      const cleanJson = text.replace(/```json\n|\n```|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      return null;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}