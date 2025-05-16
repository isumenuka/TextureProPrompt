import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { CustomPrompt } from '../types';

interface CustomPromptHistoryItemProps {
  prompt: CustomPrompt;
}

const CustomPromptHistoryItem: React.FC<CustomPromptHistoryItemProps> = ({ prompt }) => {
  const [copiedStates, setCopiedStates] = useState({
    title: false,
    keywords: false,
    prompt: false
  });
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async (type: 'title' | 'keywords' | 'prompt', text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const CopyButton = ({ type, text }: { type: 'title' | 'keywords' | 'prompt', text: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleCopy(type, text);
      }}
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
            <span className="font-medium text-gray-900">Custom Prompt</span>
            <span className="text-sm text-gray-500 ml-2">{formatDate(prompt.timestamp)}</span>
          </div>
        </div>
        <CopyButton type="prompt" text={prompt.promptText} />
      </div>
      
      {expanded && (
        <div className="px-3 pb-3">
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gray-700">Title</h4>
              <CopyButton type="title" text={prompt.title} />
            </div>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {prompt.title}
            </p>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gray-700">Keywords</h4>
              <CopyButton type="keywords" text={prompt.keywords.join(', ')} />
            </div>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {prompt.keywords.join(', ')}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Prompt</h4>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 break-words">
              {prompt.promptText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPromptHistoryItem;