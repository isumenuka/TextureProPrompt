import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Wand2, Loader2 } from 'lucide-react';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '../config/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getEnhancedRandomization } from '../services/gemini';
import { materials } from '../data/materials';
import { primaryColorTones, secondaryColorTones } from '../data/colorTones';
import { lightingStyles } from '../data/lightingStyles';
import { getRandomUnusedOption } from '../utils/selectionManager';
import type { PromptData, GeneratedPrompt } from '../types';
import ParameterSelector from './ParameterSelector';
import GeneratedPrompt from './GeneratedPrompt';
import PromptHistory from './PromptHistory';

const PromptGenerator: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>({
    materialType: '',
    primaryColorTone: '',
    secondaryColorTone: '',
    lightingStyle: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [promptHistory, setPromptHistory] = useLocalStorage<GeneratedPrompt[]>(
    STORAGE_KEYS.GENERATED_PROMPT_HISTORY,
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancedRandomizing, setIsEnhancedRandomizing] = useState(false);

  const handleParameterChange = (key: keyof PromptData, value: string) => {
    setPromptData(prev => ({ ...prev, [key]: value }));
  };

  const handleRandomizeParameter = (key: keyof PromptData) => {
    const optionsMap = {
      materialType: materials,
      primaryColorTone: primaryColorTones,
      secondaryColorTone: secondaryColorTones,
      lightingStyle: lightingStyles,
    };

    const randomValue = getRandomUnusedOption(
      promptHistory,
      optionsMap[key],
      key,
      promptData[key]
    );

    handleParameterChange(key, randomValue);
  };

  const handleRandomizeAll = async () => {
    setIsEnhancedRandomizing(true);
    try {
      const result = await getEnhancedRandomization(
        materials,
        primaryColorTones,
        secondaryColorTones,
        lightingStyles,
        promptHistory
      );
      setPromptData(result);
    } finally {
      setIsEnhancedRandomizing(false);
    }
  };

  const generatePrompt = async () => {
    const { materialType, primaryColorTone, secondaryColorTone, lightingStyle } = promptData;
    
    if (!materialType || !primaryColorTone || !secondaryColorTone || !lightingStyle) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const promptText = `${materialType} texture, seamless and high resolution, top view, ${primaryColorTone} and ${secondaryColorTone}, realistic surface detail, natural patterns, intricate texture, ${lightingStyle}, ultra detailed, texture background`;
      
      const newPrompt: GeneratedPrompt = {
        id: uuidv4(),
        ...promptData,
        promptText,
        timestamp: Date.now()
      };
      
      setGeneratedPrompt(newPrompt);
      setPromptHistory(prev => [newPrompt, ...prev].slice(0, MAX_HISTORY_ITEMS));
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    setPromptHistory([]);
  };

  const isFormComplete = Object.values(promptData).every(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Texture Generator</h2>
      <p className="text-sm text-gray-600 mb-6">Select parameters to generate a texture prompt</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ParameterSelector
            label="Material Type"
            options={materials}
            value={promptData.materialType}
            onChange={(value) => handleParameterChange('materialType', value)}
            onRandom={() => handleRandomizeParameter('materialType')}
          />
          <ParameterSelector
            label="Primary Color"
            options={primaryColorTones}
            value={promptData.primaryColorTone}
            onChange={(value) => handleParameterChange('primaryColorTone', value)}
            onRandom={() => handleRandomizeParameter('primaryColorTone')}
          />
        </div>
        <div>
          <ParameterSelector
            label="Secondary Color"
            options={secondaryColorTones}
            value={promptData.secondaryColorTone}
            onChange={(value) => handleParameterChange('secondaryColorTone', value)}
            onRandom={() => handleRandomizeParameter('secondaryColorTone')}
          />
          <ParameterSelector
            label="Lighting"
            options={lightingStyles}
            value={promptData.lightingStyle}
            onChange={(value) => handleParameterChange('lightingStyle', value)}
            onRandom={() => handleRandomizeParameter('lightingStyle')}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleRandomizeAll}
          disabled={isEnhancedRandomizing}
          className="flex-1 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Wand2 className="h-4 w-4" />
          <span>{isEnhancedRandomizing ? 'AI Randomizing...' : 'AI Randomize All'}</span>
        </button>
        <button
          onClick={generatePrompt}
          disabled={!isFormComplete || isGenerating}
          className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            'Generate Prompt'
          )}
        </button>
      </div>

      {generatedPrompt && <GeneratedPrompt prompt={generatedPrompt} />}
      <PromptHistory prompts={promptHistory} onClear={clearHistory} />
    </div>
  );
};

export default PromptGenerator;