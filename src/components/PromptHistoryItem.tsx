import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { GeneratedPrompt } from '../types';

interface PromptHistoryItemProps {
  prompt: GeneratedPrompt;
}

const PromptHistoryItem: React.FC<PromptHistoryItemProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.promptText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2 overflow-hidden transition-all duration-200">
      <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-2">
          {expanded ? 
            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500" />
          }
          <div>
            <span className="font-medium text-sm">{prompt.materialType}</span>
            <span className="text-xs text-gray-500 ml-2">{formatDate(prompt.timestamp)}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="text-amber-600 hover:text-amber-800 p-1 rounded transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100">
          <p className="text-sm text-gray-700 mb-2 break-words">{prompt.promptText}</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
            <div>
              <span className="font-medium">Primary:</span> {prompt.primaryColorTone}
            </div>
            <div>
              <span className="font-medium">Secondary:</span> {prompt.secondaryColorTone}
            </div>
            <div>
              <span className="font-medium">Lighting:</span> {prompt.lightingStyle}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptHistoryItem;