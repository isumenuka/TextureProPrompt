import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loader2 } from 'lucide-react';
import { STORAGE_KEYS, MAX_PROMPT_LENGTH, MAX_HISTORY_ITEMS } from '../config/constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateTitleAndKeywords } from '../services/gemini';
import type { CustomPrompt } from '../types';
import CustomPromptHistory from './CustomPromptHistory';

const CustomPromptGenerator: React.FC = () => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customError, setCustomError] = useState('');
  const [promptHistory, setPromptHistory] = useLocalStorage<CustomPrompt[]>(
    STORAGE_KEYS.CUSTOM_PROMPT_HISTORY,
    []
  );

  const handleGenerate = async () => {
    if (!customPrompt.trim()) return;
    
    setCustomError('');
    setIsGenerating(true);
    
    try {
      const result = await generateTitleAndKeywords(customPrompt);
      if (result) {
        const newPrompt: CustomPrompt = {
          id: uuidv4(),
          promptText: customPrompt,
          title: result.title,
          keywords: result.keywords.split(',').map(k => k.trim()),
          timestamp: Date.now(),
        };

        setPromptHistory(prev => [newPrompt, ...prev].slice(0, MAX_HISTORY_ITEMS));
        setCustomPrompt('');
      }
    } catch (error) {
      console.error('Failed to generate custom prompt:', error);
      setCustomError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    setPromptHistory([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Custom Prompt</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your prompt to generate title and keywords</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH));
                  setCustomError('');
                }}
                placeholder="Enter your custom prompt..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  customError ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isGenerating}
              />
              <div className="absolute right-2 bottom-2 text-xs text-gray-400">
                {customPrompt.length}/{MAX_PROMPT_LENGTH}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!customPrompt.trim() || isGenerating}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
          {customError && (
            <p className="text-sm text-red-600">{customError}</p>
          )}
        </div>
      </div>

      <CustomPromptHistory prompts={promptHistory} onClear={clearHistory} />
    </div>
  );
};

export default CustomPromptGenerator;