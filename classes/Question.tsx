import React from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";

interface QuestionConstructor {
  question: string;
  id: number;
}

export class Question {
  question: string;
  id: number;

  constructor({ question, id }: QuestionConstructor) {
    this.question = question;
    this.id = id;
  }

  dataBaseSave(): QuestionConstructor {
    return {
      question: this.question,
      id: this.id,
    };
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: Question) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<QuestionConstructor>(
      {
        id: Date.now() % 10000,
        question: "",
      }
    );

    const popupProps: EditableObjectPopupProps<QuestionConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: QuestionConstructor) => {
        const newObj = new Question(updatedObject);
        onSave(newObj);
      },
      title: `Create New Object`,
      fields: [{ key: "question", label: "Question", type: "textarea" }],
    };
    return <EditableObjectPopup {...popupProps} />;
  }
}
