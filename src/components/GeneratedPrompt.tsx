import React, { useState } from 'react';
import { Copy, Check, Wand2 } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { GeneratedPrompt as PromptType } from '../types';
import { generateTitleAndKeywords } from '../utils/gemini';

interface GeneratedPromptProps {
  prompt: PromptType;
}

const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ prompt }) => {
  const [copiedStates, setCopiedStates] = useState({
    title: false,
    keywords: false,
    prompt: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState(prompt.title || '');
  const [keywords, setKeywords] = useState(prompt.keywords || []);

  const handleCopy = async (type: 'title' | 'keywords' | 'prompt', text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    }
  };

  const handleGenerateTitleAndKeywords = async () => {
    setIsGenerating(true);
    try {
      const result = await generateTitleAndKeywords(prompt.promptText);
      if (result) {
        setTitle(result.title);
        setKeywords(result.keywords.split(',').map(k => k.trim()));
      }
    } catch (error) {
      console.error('Failed to generate title and keywords:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const CopyButton = ({ type, text }: { type: 'title' | 'keywords' | 'prompt', text: string }) => (
    <button
      onClick={() => handleCopy(type, text)}
      className="flex items-center space-x-1 text-amber-600 hover:text-amber-800 transition-colors px-2 py-1 rounded-md hover:bg-amber-50"
      aria-label={`Copy ${type}`}
    >
      {copiedStates[type] ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="text-sm">{copiedStates[type] ? 'Copied!' : `Copy ${type}`}</span>
    </button>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 animate-fadeIn">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800">Generated Prompt</h3>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateTitleAndKeywords}
            disabled={isGenerating}
            className="flex items-center space-x-1 text-amber-600 hover:text-amber-800 transition-colors disabled:opacity-50 px-2 py-1 rounded-md hover:bg-amber-50"
            aria-label="Generate title and keywords"
          >
            <Wand2 className="h-4 w-4" />
            <span className="text-sm">{isGenerating ? 'Generating...' : 'Generate Title'}</span>
          </button>
        </div>
      </div>

      {title && (
        <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm text-gray-700">Title</span>
            <CopyButton type="title" text={title} />
          </div>
          <p className="text-gray-700">{title}</p>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm text-gray-700">Keywords</span>
            <CopyButton type="keywords" text={keywords.join(', ')} />
          </div>
          <p className="text-gray-700">{keywords.join(', ')}</p>
        </div>
      )}

      <div className="p-3 bg-gray-50 rounded border border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-gray-700">Prompt</span>
          <CopyButton type="prompt" text={prompt.promptText} />
        </div>
        <p className="text-gray-700 break-words">{prompt.promptText}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>
          <span className="font-medium">Material:</span> {prompt.materialType}
        </div>
        <div>
          <span className="font-medium">Primary Color:</span> {prompt.primaryColorTone}
        </div>
        <div>
          <span className="font-medium">Secondary Color:</span> {prompt.secondaryColorTone}
        </div>
        <div>
          <span className="font-medium">Lighting:</span> {prompt.lightingStyle}
        </div>
      </div>
    </div>
  );
};

export default GeneratedPrompt;