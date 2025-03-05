import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { SliderControlAdvanced } from "../SliderControlAdv";
import Validation_sliderAdv from "@/classes/Validation/Validation_sliderAdv";
import { useStore, getValidationsSelector } from "@/app/store";
import Latex from "react-latex-next";
import { Label } from "@/components/ui/label";
import { relation } from "@/classes/Validation/Validation_obj";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SliderAutograderEditProps {
  control: SliderControlAdvanced<any>;
  onClose: () => void;
}

export const SliderAutograderEdit: React.FC<SliderAutograderEditProps> = ({
  control,
  onClose,
}) => {
  // Find existing validation for this control
  const validations = useStore(getValidationsSelector);
  const existingValidation = React.useMemo(() => {
    return validations.find(
      (v) => v instanceof Validation_sliderAdv && v.control_id === control.id
    ) as Validation_sliderAdv | undefined;
  }, [validations, control.id]);

  // Initialize with existing validation values if available
  const [targetValue, setTargetValue] = React.useState<number>(
    existingValidation ? existingValidation.target_value : control.localValue
  );
  const [relation, setRelation] = React.useState<relation>(
    existingValidation ? existingValidation.relation : "=="
  );

  const title = control.desc;
  const description = control.text;
  const range = control.range;
  const step = control.step_size;

  const getRelationLabel = () => {
    switch (relation) {
      case "<":
        return "Less than";
      case ">":
        return "Greater than";
      case "==":
        return "Equal to";
      default:
        return "";
    }
  };

  const saveAutograder = () => {
    const addElementFn = useStore.getState().addElement;
    const deleteValidationByIndex = useStore.getState().deleteValidationByIndex;

    // If there's an existing validation, update it by removing the old one first
    if (existingValidation) {
      const existingIndex = validations.findIndex(
        (v) => v instanceof Validation_sliderAdv && v.control_id === control.id
      );

      if (existingIndex !== -1) {
        deleteValidationByIndex(existingIndex);
      }
    }

    // Create and add the new validation with 0 error tolerance by default
    const newValidation = new Validation_sliderAdv({
      control_id: control.id,
      target_value: targetValue,
      error: 0,
      relation: relation,
      desc: `${control.desc}`,
    });

    addElementFn(newValidation);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative ring-2 ring-green-500 bg-green-50">
      <div className="absolute top-0 left-0 w-full bg-green-600 text-white text-xs px-4 py-1 rounded-t-lg">
        Set the target value and condition for autograding
      </div>

      <h3 className="text-lg font-semibold text-blue-800 mb-2 mt-4">
        <Latex>{title}</Latex>
      </h3>
      <p className="text-gray-600 mb-4">
        <Latex>{description}</Latex>
      </p>

      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Label className="text-sm font-medium">Condition:</Label>
          <Select
            value={relation}
            onValueChange={(value) => setRelation(value as relation)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="==">Equal to</SelectItem>
              <SelectItem value=">">Greater than</SelectItem>
              <SelectItem value="<">Less than</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-green-700 font-medium mb-1">
          Value should be {getRelationLabel()} {targetValue}
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={range[0]}
              max={range[1]}
              step={step}
              value={targetValue}
              onChange={(e) => setTargetValue(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-gray-700 font-medium">{targetValue}</span>
          </div>

          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{range[0]}</span>
            <span>{range[1]}</span>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-red-600"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={saveAutograder}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          margin: 10px 0;
          width: 100%;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          animate: 0.2s;
          background: #bfdbfe;
          border-radius: 4px;
        }
        input[type="range"]::-webkit-slider-thumb {
          border: 2px solid #3b82f6;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -8px;
          transition: all 0.15s ease-in-out;
        }
        input[type="range"]:focus::-webkit-slider-runnable-track {
          background: #93c5fd;
        }
        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          animate: 0.2s;
          background: #bfdbfe;
          border-radius: 4px;
        }
        input[type="range"]::-moz-range-thumb {
          border: 2px solid #3b82f6;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
        }
        input[type="range"]:hover::-webkit-slider-thumb,
        input[type="range"]:hover::-moz-range-thumb {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        input[type="range"]:active::-webkit-slider-thumb,
        input[type="range"]:active::-moz-range-thumb {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
};
