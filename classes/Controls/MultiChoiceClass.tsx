import { Control, ControlConstructor } from "./Control";
import { useStore, setMultiChoiceOptionsSelector } from "@/app/store";
import Latex from "react-latex-next";
import React from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { MultiChoiceEditor } from "../Validation/ValidationMultiChoice";
import { ValidationMultiChoice } from "../Validation/ValidationMultiChoice";

import {
  MultiChoiceControlInsert,
  MultiChoiceControlSelect,
  MultiChoiceOptionInsert,
  MultiChoiceOptionSelect,
} from "@/app/db/schema";
import { InlineMultiChoiceEdit } from "./InlineEdit/InLineMultiChoiceEdit";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
/*
 * This class is responsible for storing information about a multiple choice question
 * the attributes of this class are: options, isMultiSelect, selectedOptions
 */

export interface Option {
  id: number;
  label: string;
}

export interface MultiChoiceConstructor extends ControlConstructor {
  options: Option[];
  isMultiSelect?: boolean;
}
function ShowMultiChoice({ control, onEdit }: { control: MultiChoiceClass, onEdit?: () => void }) {
  const setSelectedOptions = useStore(setMultiChoiceOptionsSelector);
  const selectedOptions = control.selectedOptions;

  const title = control.desc;
  const description = control.text;
  const options = control.options;
  const isMultiSelect = control.isMultiSelect;
  const isClickable = control.isClickable;
  const isEditMode = useStore(state => state.isEditMode);

  const handleOptionClick = (optionId: number) => {
    if (!isClickable) return;
    let new_options = [] as number[];
    if (isMultiSelect) {
      new_options = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId];
    } else {
      new_options = [optionId];
    }

    setSelectedOptions(control.id, new_options);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 relative ${
        !isClickable ? "opacity-70" : ""
      }`}
    >
      {isEditMode && onEdit && (
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute right-2 top-2 z-10" 
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        <Latex>{title}</Latex>
      </h3>
      <p className="text-gray-600 mb-4">
        <Latex>{description}</Latex>
      </p>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`
              w-full text-left px-4 py-3 rounded-lg 
              transition-all duration-400 ease-out
              transform hover:scale-[1.02] active:scale-[0.98]
              ${
                selectedOptions.includes(option.id)
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              ${!isClickable ? "cursor-not-allowed" : "cursor-pointer"}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            `}
          >
            <div className="flex items-center">
              <div
                className={`
                w-5 h-5 mr-3 rounded-full border-2 flex-shrink-0
                transition-all duration-200 ease-out
                ${
                  selectedOptions.includes(option.id)
                    ? "border-white bg-white scale-110"
                    : "border-blue-500 bg-transparent"
                }
              `}
              >
                {selectedOptions.includes(option.id) && (
                  <svg
                    className="w-3 h-4 text-blue-800 mx-auto mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-left">
                <Latex>{option.label}</Latex>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export class MultiChoiceClass extends Control {
  options: Option[]; // the options of the multiple choice question
  isMultiSelect: boolean; // whether the multiple choice question allows multi option select or not
  selectedOptions: number[]; // the options that are currently selected for the multiple choice question

  constructor({
    id,
    desc = "MCQ",
    text = "Choose an option below",
    isClickable = true,
    options,
    isMultiSelect = false,
  }: MultiChoiceConstructor) {
    super({ id, desc: desc, text: text, isClickable });
    this.options = options;
    this.isMultiSelect = isMultiSelect;
    this.selectedOptions = []; // no options are selected initially
  }

  serialize(): [
    Omit<MultiChoiceControlInsert, "stateId">,
    Omit<MultiChoiceOptionInsert, "stateId">[]
  ] {
    const controlData: Omit<MultiChoiceControlInsert, "stateId"> = {
      id: this.id,
      controlId: this.id,
      desc: this.desc,
      text: this.text,
      isMultiSelect: this.isMultiSelect,
    };

    const optionsData: Omit<MultiChoiceOptionInsert, "stateId">[] =
      this.options.map((option) => ({
        multiChoiceControlId: this.id,
        label: option.label,
        optionId: option.id,
      }));

    return [controlData, optionsData];
  }

  static deserialize(
    data: MultiChoiceControlSelect,
    options: MultiChoiceOptionSelect[]
  ): MultiChoiceClass {
    return new MultiChoiceClass({
      id: data.controlId,
      desc: data.desc,
      text: data.text,
      isMultiSelect: data.isMultiSelect,
      options: options.map((opt) => ({
        id: opt.optionId,
        label: opt.label,
      })),
    });
  }

  // change the selected options of the multiple choice question used by the storage system
  setOptions(options: number[]) {
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.selectedOptions = options;
    return new_obj;
  }

  dataBaseSave(): MultiChoiceConstructor & { type: string } {
    return {
      id: this.id,
      desc: this.desc,
      text: this.text,
      options: this.options,
      isMultiSelect: this.isMultiSelect,
      type: "MultiChoiceClass",
    };
  }

  static createValidation(
    multiChoiceId: number,
    correctAnswers: number[]
  ): ValidationMultiChoice {
    return new ValidationMultiChoice({
      answer: correctAnswers,
      control_id: multiChoiceId,
      desc: `Validation for MultiChoice ${multiChoiceId}`,
    });
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: MultiChoiceClass, validation?: ValidationMultiChoice) => void;
  }) {
    const [editedObject, setEditedObject] =
      React.useState<MultiChoiceConstructor>({
        id: Date.now() % 10000,
        desc: "below is a multiple choice question",
        options: [],
        isMultiSelect: false,
        text: "MCQ",
      });
    const [validation, setValidation] = React.useState<
      ValidationMultiChoice | undefined
    >(undefined);

    const handleChange = (field: string, value: any) => {
      setEditedObject((prev) => ({ ...prev, [field]: value }));
    };

    const popupProps: EditableObjectPopupProps<MultiChoiceConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: MultiChoiceConstructor) => {
        const newObj = new MultiChoiceClass(updatedObject);
        onSave(newObj, validation);
      },
      title: `Create New Multiple Choice Question`,
      fields: [
        { key: "desc", label: "Title", type: "title" },
        { key: "text", label: "Description", type: "textarea" },
        { key: "options", label: "Options", type: "addoptions" },
        {
          key: "isMultiSelect",
          label: "Allow Multiple Selections",
          type: "checkbox",
        },
      ],
      additionalContent: (
        <MultiChoiceEditor
          onChange={(newValidation) => setValidation(newValidation)}
          value={editedObject}
          options={editedObject.options}
          id={editedObject.id}
        />
      ),
    };

    return <EditableObjectPopup {...popupProps} />;
  }

  render(): React.ReactNode {
    return <MultiChoiceRenderer control={this} />;
  }
}

function MultiChoiceRenderer({ control }: { control: MultiChoiceClass }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const isEditMode = useStore(state => state.isEditMode);
  
  if (isEditing && isEditMode) {
    return <InlineMultiChoiceEdit 
      control={control} 
      onClose={() => setIsEditing(false)} 
    />;
  }

  return <ShowMultiChoice 
    control={control} 
    onEdit={isEditMode ? () => setIsEditing(true) : undefined}
  />;
}
