import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { useStore } from '@/app/store';
import { FunctionScore } from '../../Scores/FunctionScore';
import FunctionStr, { FunctionStrEditor } from '../FunctionStr';
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ValidationScoreEditor } from '../../Validation/Validation_score';
import { obj } from '@/classes/vizobjects/obj';

interface InlineFunctionScoreEditProps {
  score: FunctionScore;
  onClose: () => void;
}

export const InlineFunctionScoreEdit: React.FC<InlineFunctionScoreEditProps> = ({ score, onClose }) => {
  const [editedValues, setEditedValues] = React.useState({
    score_id: score.score_id,
    text: score.text,
    desc: score.desc,
    functionStr: score.functionStr,
    obj_list: score.obj_list,
  });

  const [showValidation, setShowValidation] = React.useState(false);
  const [validation, setValidation] = React.useState<any>(undefined);

  const handleSave = () => {
    const updatedScore = new FunctionScore({
      score_id: score.score_id,
      text: editedValues.text,
      desc: editedValues.desc,
      functionStr: editedValues.functionStr,
      obj_list: [], // This will be populated by the constructor
    });

    useStore.getState().setScore(score.score_id, updatedScore);
    onClose();
  };

  const handleFunctionStrChange = (newFunctionStr: FunctionStr) => {
    setEditedValues(prev => ({
      ...prev,
      functionStr: newFunctionStr,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Basic Information */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Title</Label>
          <Input
            value={editedValues.text}
            onChange={(e) => setEditedValues(prev => ({ ...prev, text: e.target.value }))}
            className="text-lg font-semibold text-blue-800"
          />
        </div>
        
        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Textarea
            value={editedValues.desc}
            onChange={(e) => setEditedValues(prev => ({ ...prev, desc: e.target.value }))}
            className="text-gray-600"
          />
        </div>
      </div>

      <Separator />

      {/* Function Editor */}
      <div className="space-y-2">
        <Label>Score Function</Label>
        <FunctionStrEditor
          value={editedValues.functionStr}
          onChange={handleFunctionStrChange}
        />
      </div>

      {/* <Separator /> */}

      {/* Validation Section */}
      {/* <Collapsible open={showValidation} onOpenChange={setShowValidation}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-between items-center"
          >
            Validation Settings
            {showValidation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <ValidationScoreEditor
            onChange={(newValidation) => setValidation(newValidation)}
            scoreId={editedValues.score_id}
          />
        </CollapsibleContent>
      </Collapsible> */}

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          variant="default"
          size="sm"
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};