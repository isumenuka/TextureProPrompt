import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shuffle } from 'lucide-react';

interface ParameterSelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onRandom: () => void;
}

const ParameterSelector: React.FC<ParameterSelectorProps> = ({
  label,
  options,
  value,
  onChange,
  onRandom,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <div 
          className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-amber-500 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{value || `Select ${label}`}</span>
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 mr-1 text-gray-400 hover:text-amber-600 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onRandom();
              }}
              aria-label="Random selection"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul className="py-1">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-amber-50 cursor-pointer transition-colors"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParameterSelector;