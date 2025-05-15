import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Wand2 } from 'lucide-react';
import ParameterSelector from './ParameterSelector';
import GeneratedPrompt from './GeneratedPrompt';
import PromptHistory from './PromptHistory';
import { materials } from '../data/materials';
import { primaryColorTones, secondaryColorTones } from '../data/colorTones';
import { lightingStyles } from '../data/lightingStyles';
import { getRandomElement } from '../utils/random';
import { getEnhancedRandomization } from '../utils/gemini';
import { PromptData, GeneratedPrompt as PromptType } from '../types';

const STORAGE_KEY = 'texture-prompt-history';
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

  // New effect to trigger AI suggestions when material type changes
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
      } else {
        // Fallback to basic randomization
        setPromptData({
          materialType: getRandomElement(materials),
          primaryColorTone: getRandomElement(primaryColorTones),
          secondaryColorTone: getRandomElement(secondaryColorTones),
          lightingStyle: getRandomElement(lightingStyles),
        });
      }
    } catch (error) {
      console.error('Enhanced randomization failed:', error);
      // Fallback to basic randomization
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

  const generatePrompt = () => {
    const { materialType, primaryColorTone, secondaryColorTone, lightingStyle } = promptData;
    
    if (!materialType || !primaryColorTone || !secondaryColorTone || !lightingStyle) {
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const promptText = `${materialType} texture, seamless and high resolution, top view, ${primaryColorTone} and ${secondaryColorTone}, realistic surface detail, natural patterns, intricate texture, ${lightingStyle}, ultra detailed, texture background`;
      
      const newPrompt: PromptType = {
        id: uuidv4(),
        ...promptData,
        promptText,
        timestamp: Date.now(),
      };
      
      setGeneratedPrompt(newPrompt);
      
      setPromptHistory((prev) => {
        const updatedHistory = [newPrompt, ...prev].slice(0, MAX_HISTORY);
        return updatedHistory;
      });
      
      setIsGenerating(false);
    }, 500);
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="w-full md:w-1/2">
            <ParameterSelector
              label="Material Type"
              options={materials}
              value={promptData.materialType}
              onChange={(value) => handleParameterChange('materialType', value)}
              onRandom={handleRandomMaterial}
            />
            <ParameterSelector
              label="Primary Color Tone"
              options={primaryColorTones}
              value={promptData.primaryColorTone}
              onChange={(value) => handleParameterChange('primaryColorTone', value)}
              onRandom={handleRandomPrimaryColor}
            />
          </div>
          <div className="w-full md:w-1/2">
            <ParameterSelector
              label="Secondary Color Tone"
              options={secondaryColorTones}
              value={promptData.secondaryColorTone}
              onChange={(value) => handleParameterChange('secondaryColorTone', value)}
              onRandom={handleRandomSecondaryColor}
            />
            <ParameterSelector
              label="Lighting Style"
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
            className="flex-1 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            <span>{isEnhancedRandomizing ? 'AI Randomizing...' : 'AI Randomize All'}</span>
          </button>
          <button
            onClick={generatePrompt}
            disabled={!isFormComplete || isGenerating}
            className={`flex-1 px-4 py-2 rounded-lg font-medium ${
              isFormComplete
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition-colors flex items-center justify-center`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Prompt'
            )}
          </button>
        </div>
      </div>

      {generatedPrompt && <GeneratedPrompt prompt={generatedPrompt} />}
      
      <PromptHistory prompts={promptHistory} onClear={clearHistory} />
    </div>
  );
};

export default PromptGenerator;