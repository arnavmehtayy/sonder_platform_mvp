import React, { useState } from 'react';
import { Option } from '@/classes/Controls/MultiChoiceClass';



interface MCQPopupProps {
  onSubmit: (id: number, title: string, desc: string, options: Option[]) => void;
  onClose: () => void;
}

export const MCQPopup: React.FC<MCQPopupProps> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [options, setOptions] = useState<Option[]>([{ id: 1, label: '' }]);

  const handleAddOption = () => {
    setOptions([...options, { id: options.length + 1, label: '' }]);
  };

  const handleOptionChange = (id: number, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Date.now(), title, desc, options);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Multiple Choice Question</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border rounded mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question Title"
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Question Description"
            rows={3}
          />
          {options.map((option) => (
            <input
              key={option.id}
              className="w-full p-2 border rounded mb-2"
              value={option.label}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${option.id}`}
            />
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="mb-4 px-4 py-2 bg-gray-200 rounded"
          >
            Add Option
          </button>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add MCQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};