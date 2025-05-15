import React from 'react';
import PromptHistoryItem from './PromptHistoryItem';
import { GeneratedPrompt } from '../types';
import { HistoryIcon } from 'lucide-react';

interface PromptHistoryProps {
  prompts: GeneratedPrompt[];
  onClear: () => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ prompts, onClear }) => {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <HistoryIcon className="h-4 w-4 text-gray-500" />
          <h3 className="text-md font-medium text-gray-700">Recent Prompts</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-amber-700 transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto pr-1">
        {prompts.map((prompt) => (
          <PromptHistoryItem key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
};

export default PromptHistory;