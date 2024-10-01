import { Score, ScoreConstructor } from "./Score";
import { FunctionStr, FunctionStrEditor, FunctionStrConstructor } from '../Controls/FunctionStr';
import { obj } from "../vizobjects/obj";
import React, { useState, useEffect } from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { useStore } from '@/app/store';
import { objectScorer } from "./objectScorer";
import { atts } from '../vizobjects/get_set_obj_attributes';

export interface FunctionScoreConstructor{
  score_id: number
  functionStr: FunctionStr;
  text: string;
  desc: string;
  to_string?: (score: number) => string
}

export class FunctionScore extends Score<number> {
  functionStr: FunctionStr;

  constructor({
    score_id,
    text,
    desc,
    functionStr,
    to_string = (score) => score.toFixed(2).toString(),
  }: FunctionScoreConstructor) {
    super({
      score_id,
      text,
      desc,
      obj_list: [],
      transformation: () => 0 , // Placeholder, will be overwritten
      to_string,
    });
    this.functionStr = functionStr;
    this.transformation = this.createTransformation();
    this.updateObjList();
  }

  private createTransformation(): (vals: number[]) => number {
    const func = this.functionStr.get_function();
    const getState = useStore.getState;
    return (vals: number[]) => {
      const result = func(0, getState);
      return result ;
    };
  }

  private updateObjList() {
    this.obj_list = this.functionStr.symbols.map(symbol => {
      const getter = atts[symbol.obj_type]?.number[symbol.attribute]?.get_attribute;
      return new objectScorer({
        id: symbol.obj_id,
        get_attribute: (obj: obj) => getter ? getter(obj) : 0
      });
    });
  }

//   dataBaseSave(): FunctionScoreConstructor<Score_T> & { type: string } {
//     return {
//       score_id: this.score_id,
//       text: this.text,
//       desc: this.desc,
//       functionStr: this.functionStr,
//       type: 'FunctionScore',
//     };
//   }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: FunctionScore) => void;
  }) {
    const [editedObject, setEditedObject] = useState<FunctionScoreConstructor>({
      score_id: Date.now() % 10000,
      text: "",
      desc: "",
      functionStr: new FunctionStr(Date.now() % 10000, "x", [])
    });

    const handleFunctionStrChange = (newFunctionStr: FunctionStr) => {
      setEditedObject(prev => ({
        ...prev,
        functionStr: newFunctionStr,
      }));
    };

    const popupProps: EditableObjectPopupProps<FunctionScoreConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: FunctionScoreConstructor) => {
        const newObj = new FunctionScore(updatedObject);
        onSave(newObj);
      },
      title: "Create New Function Score",
      fields: [
        { key: "text", label: "Text", type: "text" },
        { key: "desc", label: "Description", type: "textarea" },
        {
          key: "functionStr",
          label: "Score Function",
          type: "custom",
          render: (value: FunctionStr, onChange: (value: FunctionStr) => void) => (
            <FunctionStrEditor value={value} onChange={handleFunctionStrChange} />
          ),
        },
      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}