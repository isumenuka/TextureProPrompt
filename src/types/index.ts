export interface PromptData {
  materialType: string;
  primaryColorTone: string;
  secondaryColorTone: string;
  lightingStyle: string;
}

export interface GeneratedPrompt extends PromptData {
  id: string;
  promptText: string;
  timestamp: number;
}