'use client';
import React, { useState } from 'react';
import { HelpCircle, List, ChevronDown, Plus, X } from 'lucide-react';
import { useStore, addQuestionEditor, addMCQuestionEditor } from '@/app/store';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Latex from "react-latex-next";
import { ObjectCreator, PopUpType } from './ObjectCreator';
import coloredObj from '@/classes/vizobjects/coloredObj';
import { obj } from '@/classes/vizobjects/obj';
import { TransformObj } from '@/classes/vizobjects/transformObj';
import { LineObj } from '@/classes/vizobjects/Lineobj';
import { geomobj } from '@/classes/vizobjects/geomobj';
import FunctionPlotString from '@/classes/vizobjects/FunctionPlotString';
import CoordinateAxis from '@/classes/vizobjects/CoordinateAxis';

export interface Option {
  id: number;
  label: string;
}

interface ButtonItem {
  name: string;
  icon: React.ElementType;
}

interface ObjectType {
  name: string;
  type: PopUpType;
  icon: React.ElementType;
}

export const EditBar: React.FC = () => {
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isMCQDialogOpen, setIsMCQDialogOpen] = useState(false);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | null>(null);
  const addQuestion = useStore(addQuestionEditor);
  const addMCQuestion = useStore(addMCQuestionEditor);

  const [questionText, setQuestionText] = useState('');
  const [mcqTitle, setMcqTitle] = useState('');
  const [mcqDesc, setMcqDesc] = useState('');
  const [mcqOptions, setMcqOptions] = useState<Option[]>([{ id: 1, label: '' }]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const buttons: ButtonItem[] = [
    { name: 'Add Question Text', icon: HelpCircle },
    { name: 'Add Multiple Choice', icon: List },

  ];

  const objectTypes: ObjectType[] = [
    {name: 'Line Object', type: LineObj, icon: HelpCircle },
    {name: 'Geom Object', type: geomobj, icon: HelpCircle },
    {name: 'Function Object', type: FunctionPlotString, icon: HelpCircle },
    {name: 'Axis Object', type: CoordinateAxis, icon: HelpCircle },
  ];


  const handleAddQuestion = () => {
    const id = Math.floor(Date.now());
    addQuestion(id)(questionText);
    setQuestionText('');
    setIsQuestionDialogOpen(false);
  };

  const handleAddMCQ = () => {
    const id = Math.floor(Date.now());
    addMCQuestion(id, mcqTitle, mcqDesc, mcqOptions);
    setMcqTitle('');
    setMcqDesc('');
    setMcqOptions([{ id: 1, label: '' }]);
    setIsMultiSelect(false);
    setIsMCQDialogOpen(false);
  };

  const handleAddMCQOption = () => {
    setMcqOptions([...mcqOptions, { id: mcqOptions.length + 1, label: '' }]);
  };

  const handleRemoveMCQOption = (id: number) => {
    setMcqOptions(mcqOptions.filter(option => option.id !== id));
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Question</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {buttons.map((item) => (
              <DropdownMenuItem key={item.name} onSelect={() => item.name === 'Add Question Text' ? setIsQuestionDialogOpen(true) : setIsMCQDialogOpen(true)}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Object</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {objectTypes.map((objectType) => (
              <DropdownMenuItem 
                key={objectType.type.name} 
                onSelect={() => setSelectedObjectType(objectType)}
              >
                <objectType.icon className="mr-2 h-4 w-4" />
                <span>{objectType.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Question Text</DialogTitle>
          </DialogHeader>
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button onClick={handleAddQuestion}>Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMCQDialogOpen} onOpenChange={setIsMCQDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Multiple Choice Question</DialogTitle>
          </DialogHeader>
          <>
            <Input
              value={mcqTitle}
              onChange={(e) => setMcqTitle(e.target.value)}
              placeholder="Question Title"
              className="text-lg font-semibold text-blue-800 mb-2"
            />
            <Textarea
              value={mcqDesc}
              onChange={(e) => setMcqDesc(e.target.value)}
              placeholder="Question Description"
              className="text-gray-600 mb-2"
            />
            <div className="space-y-3 mt-4">
              {mcqOptions.map((option, index) => (
                <div key={option.id} className="flex items-center">
                  <Input
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...mcqOptions];
                      newOptions[index].label = e.target.value;
                      setMcqOptions(newOptions);
                    }}
                    placeholder={`Option ${option.id}`}
                    className="flex-grow mr-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-700"
                  />
                  <Button 
                    onClick={() => handleRemoveMCQOption(option.id)}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={handleAddMCQOption} variant="outline" className="mt-3">
              Add Option
            </Button>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="multiSelect"
                checked={isMultiSelect}
                onChange={(e) => setIsMultiSelect(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="multiSelect">Allow multiple selections</label>
            </div>
            </>
          <DialogFooter>
            <Button onClick={handleAddMCQ}>Add MCQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedObjectType && (
        <ObjectCreator 
          ObjectType={selectedObjectType.type}
          onClose={() => setSelectedObjectType(null)}
        />
      )}
    </>
  );
};