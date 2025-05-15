import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { GeneratedPrompt as PromptType } from '../types';

interface GeneratedPromptProps {
  prompt: PromptType;
}

const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.promptText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 animate-fadeIn">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800">Generated Prompt</h3>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-amber-600 hover:text-amber-800 transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="bg-gray-50 p-3 rounded border border-gray-200">
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