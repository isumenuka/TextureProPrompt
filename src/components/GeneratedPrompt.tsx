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
      className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50 transition-colors"
      aria-label={`Copy ${type}`}
    >
      {copiedStates[type] ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Generated Prompt</h3>
        <button
          onClick={handleGenerateTitleAndKeywords}
          disabled={isGenerating}
          className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
        >
          <Wand2 className="h-4 w-4" />
        </button>
      </div>

      {title && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <CopyButton type="title" text={title} />
          </div>
          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{title}</p>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Keywords</span>
            <CopyButton type="keywords" text={keywords.join(', ')} />
          </div>
          <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{keywords.join(', ')}</p>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Prompt</span>
          <CopyButton type="prompt" text={prompt.promptText} />
        </div>
        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg break-words">{prompt.promptText}</p>
      </div>

      {prompt.materialType !== 'Custom' && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-2 rounded-lg">
            <span className="font-medium text-gray-700">Material:</span>
            <span className="text-gray-600 ml-2">{prompt.materialType}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <span className="font-medium text-gray-700">Primary Color:</span>
            <span className="text-gray-600 ml-2">{prompt.primaryColorTone}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <span className="font-medium text-gray-700">Secondary Color:</span>
            <span className="text-gray-600 ml-2">{prompt.secondaryColorTone}</span>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <span className="font-medium text-gray-700">Lighting:</span>
            <span className="text-gray-600 ml-2">{prompt.lightingStyle}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedPrompt;