
import React from 'react';
import { TouchControlAttributes } from '@/classes/Controls/TouchControl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TouchControl } from '@/classes/Controls/TouchControl';



interface TouchControlAttributeEditorProps {
  label: string;
  attributes: TouchControlAttributes | null;
  onChange: (attributes: TouchControlAttributes | null) => void;
}
export function TouchControlAttributeEditor({
  label,
  attributes,
  onChange,
}: TouchControlAttributeEditorProps) {
  const updateAttributes = (key: keyof NonNullable<TouchControlAttributes>, value: any) => {
    if (attributes === null) {
      onChange({
        direction: [false, false, false],
        step_size: 0.1,
        [key]: value
      });
    } else {
      onChange({ ...attributes, [key]: value });
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-sm">
      <label className="block mb-2 font-semibold">{label}</label>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={attributes !== null}
            onCheckedChange={(checked) =>
              onChange(checked ? {
                direction: [false, false, false],
                step_size: 0.1
              } : null)
            }
          />
          <Label>Enabled</Label>
        </div>

        {attributes !== null && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label className="font-medium">Direction</Label>
              <div className="flex space-x-4">
                {['X', 'Y', 'Z'].map((axis, index) => (
                  <div key={axis} className="flex items-center space-x-2">
                    <Checkbox
                      checked={attributes.direction[index]}
                      onCheckedChange={(checked) => {
                        const newDirection = [...attributes.direction];
                        newDirection[index] = checked as boolean;
                        updateAttributes("direction", newDirection);
                      }}
                    />
                    <Label>{axis}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

           

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label className="font-medium">Step Size: {attributes.step_size.toFixed(2)}</Label>
              <Slider
                value={[attributes.step_size]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={([value]) => updateAttributes("step_size", value)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface TouchControlEditorProps {
  touchControl: TouchControl;
  onChange: (touchControl: TouchControl) => void;
}


export function TouchControlEditor({ touchControl, onChange }: TouchControlEditorProps) {
  const updateTouchControl = (key: keyof TouchControl, value: any) => {
    onChange(new TouchControl({ ...touchControl, [key]: value }));
  };

  return (
    <div>
      <TouchControlAttributeEditor
        label="Scale"
        attributes={touchControl.scale}
        onChange={(value) => updateTouchControl("scale", value)}
      />
      <TouchControlAttributeEditor
        label="Rotate"
        attributes={touchControl.rotate}
        onChange={(value) => updateTouchControl("rotate", value)}
      />
      <TouchControlAttributeEditor
        label="Translate"
        attributes={touchControl.translate}
        onChange={(value) => updateTouchControl("translate", value)}
      />
    </div>
  );
}
