import { Score, ScoreConstructor } from "./Score";
import { FunctionStr, FunctionStrEditor, FunctionStrConstructor } from '../Controls/FunctionStr';
import { obj } from "../vizobjects/obj";
import React, { useState, useEffect } from "react";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { getObjectSelector2, useStore } from '@/app/store';
import { objectScorer } from "./objectScorer";
import { atts } from '../vizobjects/get_set_obj_attributes';
import Validation_score, { Validation_score_constructor, ValidationScoreEditor } from "../Validation/Validation_score";
import { FunctionScoreInsert, FunctionScoreSelect } from "@/app/db/schema";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Latex from "react-latex-next";
import { InlineFunctionScoreEdit } from "../Controls/InlineEdit/InLineScoreEdit";

export interface FunctionScoreConstructor extends ScoreConstructor<number>{
  score_id: number
  functionStr: FunctionStr;
  text: string;
  desc: string;
  to_string?: (score: number) => string
}

function FunctionScoreRenderer({ score }: { score: FunctionScore }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const isEditMode = useStore(state => state.isEditMode);
  
  if (isEditing && isEditMode) {
    return <InlineFunctionScoreEdit 
      score={score} 
      onClose={() => setIsEditing(false)} 
    />;
  }

  return <ShowFunctionScore 
    score={score} 
    onEdit={isEditMode ? () => setIsEditing(true) : undefined}
  />;
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

  dataBaseSave(): FunctionScoreConstructor {
    return {
      score_id: this.score_id,
      text: this.text,
      desc: this.desc,
      functionStr: this.functionStr,
      obj_list: [],
      type: "FunctionScore"
    };
  }

  serialize(): Omit<FunctionScoreInsert, 'stateId'> {
    return {
      id: this.score_id,
      scoreId: this.score_id,
      // Base Score properties
      text: this.text,
      desc: this.desc,
      // FunctionScore specific properties
      functionStr: this.functionStr.functionString,
      functionSymbols: this.functionStr.symbols
    };
  }

  static deserialize(data: FunctionScoreSelect): FunctionScore {
    const score = new FunctionScore({
      score_id: data.scoreId,
      text: data.text,
      desc: data.desc,
      obj_list: [], // this is populated by the constructor
      functionStr: new FunctionStr(data.functionStr, data.functionSymbols)
    });

    return score;
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: FunctionScore, validation?: Validation_score<number, obj>) => void;
  }) {
    const [editedObject, setEditedObject] = useState<FunctionScoreConstructor>({
      score_id: Date.now() % 10000,
      text: "",
      desc: "",
      functionStr: new FunctionStr( "x", []),
      obj_list: [], // this will be populated by the constructor
      transformation: () => 0 // this is useless comes from parent class
    });
    const [validation, setValidation] = useState<Validation_score_constructor<number, obj> | undefined>(undefined);

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
        const newVal = validation ? new Validation_score(validation) : undefined;
        console.log(newVal)
        onSave(newObj, newVal);
      },
      title: "Create New Function Score",
      fields: [
        { key: "text", label: "Text", type: "title" },
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
      additionalContent: (
        <ValidationScoreEditor
          onChange={(newValidation: Validation_score_constructor<number, obj> | undefined) => setValidation(newValidation)}
          scoreId={editedObject.score_id}
        />
    )
    };

    return <EditableObjectPopup {...popupProps} />;
  }

  render(): React.ReactNode {
    return <FunctionScoreRenderer score={this} />;
  }
}

function ShowFunctionScore({ score, onEdit }: { score: FunctionScore; onEdit?: () => void }) {
  const [scoreValue, setScoreValue] = useState<number | null>(null);
  const get_obj = useStore(getObjectSelector2);
  const isEditMode = useStore(state => state.isEditMode);

  useEffect(() => {
    if (score) {
      const objs = score.obj_list.map((obj) => get_obj(obj.id));
      setScoreValue(score.computeValue(objs));
    }
  }, [get_obj, score]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 relative">
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
        <Latex>{score.text}</Latex>
      </h3>
      <p className="text-gray-600 mb-2">
        <Latex>{score.desc}</Latex>
      </p>
      <div className="flex items-center justify-end">
        <span className="text-2xl font-bold text-blue-600">
          {scoreValue !== null ? (
            score.to_string(scoreValue)
          ) : (
            <span className="text-gray-400 text-lg">Calculating...</span>
          )}
        </span>
      </div>
      {scoreValue !== null && (
        <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, scoreValue)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
