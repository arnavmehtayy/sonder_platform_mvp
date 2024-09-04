import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, List, ChevronDown, Plus } from 'lucide-react';

interface ButtonItem {
  name: string;
  icon: React.ElementType;
}

export const EditBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const buttons: ButtonItem[] = [
    { name: 'Add Question Text', icon: HelpCircle },
    { name: 'Add Multiple Choice', icon: List },
  ];

  const handleButtonClick = (name: string) => {
    console.log(`${name} clicked`);
    setIsOpen(false);
  };

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

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Add Question</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {buttons.map((item) => (
                  <button
                    key={item.name}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:bg-gray-600 focus:text-white transition duration-150 ease-in-out"
                    onClick={() => handleButtonClick(item.name)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 p-2 rounded-md transition-colors duration-200">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 p-2 rounded-md transition-colors duration-200">
          <List className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};