// Base Types
export interface PromptData {
  materialType: string;
  primaryColorTone: string;
  secondaryColorTone: string;
  lightingStyle: string;
}

// Generated Prompts
export interface GeneratedPrompt extends PromptData {
  id: string;
  promptText: string;
  timestamp: number;
  title?: string;
  keywords?: string[];
}

// Custom Prompts
export interface CustomPrompt {
  id: string;
  promptText: string;
  timestamp: number;
  title: string;
  keywords: string[];
}

// API Responses
export interface TitleAndKeywordsResponse {
  title: string;
  keywords: string;
}

export interface EnhancedRandomizationResponse {
  materialType: string;
  primaryColorTone: string;
  secondaryColorTone: string;
  lightingStyle: string;
}

// Component Props
export interface ParameterSelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onRandom: () => void;
}

export interface CustomPromptHistoryProps {
  prompts: CustomPrompt[];
  onClear: () => void;
}

export interface CustomPromptHistoryItemProps {
  prompt: CustomPrompt;
}

export interface GeneratedPromptProps {
  prompt: GeneratedPrompt;
}

export interface PromptHistoryProps {
  prompts: GeneratedPrompt[];
  onClear: () => void;
}

export interface PromptHistoryItemProps {
  prompt: GeneratedPrompt;
}