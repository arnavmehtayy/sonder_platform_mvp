'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { X } from 'lucide-react';

interface MCQOption {
  id: string;
  label: string;
}

interface MCQOptionsInputProps {
  options: MCQOption[];
  onChange: (newOptions: MCQOption[]) => void;
}

export function MCQOptionsInput({ options, onChange }: MCQOptionsInputProps) {
  const handleAddOption = () => {
    const newOption: MCQOption = { id:(Date.now() % 10000).toString(), label: '' };
    onChange([...options, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    onChange(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, newLabel: string) => {
    onChange(options.map(option => 
      option.id === id ? { ...option, label: newLabel } : option
    ));
  };

  return (
    <div className="space-y-3 mt-4">
      {options.map((option) => (
        <div key={option.id} className="flex items-center">
          <Input
            value={option.label}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            placeholder={`Option ${option.id}`}
            className="flex-grow mr-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-700"
          />
          <Button
            onClick={() => handleRemoveOption(option.id)}
            variant="ghost"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={handleAddOption} variant="outline" className="mt-3">
        Add Option
      </Button>
    </div>
  );
}