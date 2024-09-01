import React from 'react';
import { HelpCircle, List } from 'lucide-react';

export function EditBar() {
  const buttons = [
    { name: 'Add Question', icon: HelpCircle },
    { name: 'Add Multiple Choice', icon: List },
  ];

  return (
    <div className="bg-gray-800 p-4 flex justify-center items-center space-x-4">
      {buttons.map((item) => (
        <button
          key={item.name}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
          onClick={() => console.log(`${item.name} clicked`)}
        >
          <item.icon size={24} />
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
};