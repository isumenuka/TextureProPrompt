import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Wand2, Loader2 } from 'lucide-react';
import ParameterSelector from './ParameterSelector';
import GeneratedPrompt from './GeneratedPrompt';
import PromptHistory from './PromptHistory';
import { materials } from '../data/materials';
import { primaryColorTones, secondaryColorTones } from '../data/colorTones';
import { lightingStyles } from '../data/lightingStyles';
import { getRandomElement } from '../utils/random';
import { getEnhancedRandomization, generateTitleAndKeywords } from '../utils/gemini';
import { PromptData, GeneratedPrompt as PromptType } from '../types';

const STORAGE_KEY = 'texturepro-generated-prompt-history';
const MAX_HISTORY = 10;

const PromptGenerator: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>({
    materialType: '',
    primaryColorTone: '',
    secondaryColorTone: '',
    lightingStyle: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<PromptType | null>(null);
  const [promptHistory, setPromptHistory] = useState<PromptType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancedRandomizing, setIsEnhancedRandomizing] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse prompt history:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promptHistory));
  }, [promptHistory]);

  useEffect(() => {
    const getSuggestions = async () => {
      if (promptData.materialType && !isEnhancedRandomizing) {
        setIsEnhancedRandomizing(true);
        try {
          const suggestions = await getEnhancedRandomization({
            materialType: promptData.materialType
          });
          setPromptData(prev => ({
            ...prev,
            primaryColorTone: suggestions.primaryColorTone,
            secondaryColorTone: suggestions.secondaryColorTone,
            lightingStyle: suggestions.lightingStyle
          }));
        } catch (error) {
          console.error('Failed to get AI suggestions:', error);
        } finally {
          setIsEnhancedRandomizing(false);
        }
      }
    };

    getSuggestions();
  }, [promptData.materialType]);

  const handleParameterChange = (key: keyof PromptData, value: string) => {
    setPromptData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRandomMaterial = () => {
    handleParameterChange('materialType', getRandomElement(materials));
  };

  const handleRandomPrimaryColor = () => {
    handleParameterChange('primaryColorTone', getRandomElement(primaryColorTones));
  };

  const handleRandomSecondaryColor = () => {
    handleParameterChange('secondaryColorTone', getRandomElement(secondaryColorTones));
  };

  const handleRandomLighting = () => {
    handleParameterChange('lightingStyle', getRandomElement(lightingStyles));
  };

  const handleRandomizeAll = async () => {
    setIsEnhancedRandomizing(true);
    try {
      const enhancedResult = await getEnhancedRandomization(promptData);
      if (enhancedResult) {
        setPromptData(enhancedResult);
      }
    } catch (error) {
      console.error('Enhanced randomization failed:', error);
      setPromptData({
        materialType: getRandomElement(materials),
        primaryColorTone: getRandomElement(primaryColorTones),
        secondaryColorTone: getRandomElement(secondaryColorTones),
        lightingStyle: getRandomElement(lightingStyles),
      });
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
      
      const titleAndKeywords = await generateTitleAndKeywords(promptText);
      
      const newPrompt: PromptType = {
        id: uuidv4(),
        ...promptData,
        promptText,
        timestamp: Date.now(),
        title: titleAndKeywords?.title || '',
        keywords: titleAndKeywords?.keywords.split(',').map(k => k.trim()) || [],
      };
      
      setGeneratedPrompt(newPrompt);
      
      setPromptHistory((prev) => {
        const updatedHistory = [newPrompt, ...prev].slice(0, MAX_HISTORY);
        return updatedHistory;
      });
    } catch (error) {
      console.error('Failed to generate prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isFormComplete = 
    promptData.materialType && 
    promptData.primaryColorTone && 
    promptData.secondaryColorTone && 
    promptData.lightingStyle;

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
            onRandom={handleRandomMaterial}
          />
          <ParameterSelector
            label="Primary Color"
            options={primaryColorTones}
            value={promptData.primaryColorTone}
            onChange={(value) => handleParameterChange('primaryColorTone', value)}
            onRandom={handleRandomPrimaryColor}
          />
        </div>
        <div>
          <ParameterSelector
            label="Secondary Color"
            options={secondaryColorTones}
            value={promptData.secondaryColorTone}
            onChange={(value) => handleParameterChange('secondaryColorTone', value)}
            onRandom={handleRandomSecondaryColor}
          />
          <ParameterSelector
            label="Lighting"
            options={lightingStyles}
            value={promptData.lightingStyle}
            onChange={(value) => handleParameterChange('lightingStyle', value)}
            onRandom={handleRandomLighting}
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