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
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      <div 
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? 
            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500" />
          }
          <div>
            <span className="font-medium text-gray-900">{prompt.materialType}</span>
            <span className="text-sm text-gray-500 ml-2">{formatDate(prompt.timestamp)}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50 transition-colors"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      
      {expanded && (
        <div className="px-3 pb-3">
          <p className="text-gray-700 mb-3 break-words bg-white p-3 rounded-lg border border-gray-200">
            {prompt.promptText}
          </p>
          {prompt.materialType !== 'Custom' && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">
                <span className="font-medium text-gray-700">Primary:</span> {prompt.primaryColorTone}
              </div>
              <div className="text-gray-600">
                <span className="font-medium text-gray-700">Secondary:</span> {prompt.secondaryColorTone}
              </div>
              <div className="text-gray-600">
                <span className="font-medium text-gray-700">Lighting:</span> {prompt.lightingStyle}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptHistoryItem;