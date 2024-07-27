import {
  useStore,
  setControlValueSelector,
  useControlSelector,
  useControlValueSelector, 
} from "../store";
import { useShallow } from "zustand/react/shallow";
import { Influence } from "@/classes/influence";
import { Vector2 } from "three";
import { SliderControl } from "@/classes/SliderControl";

/*
 * This component is a number slider that allows the user to control a numerical value.
 * It takes in a control_id and renders a slider that controls using the setControlValueSelector
 * This will update the state of the object that the control is associated with.
 * DO NOT USE THE set_attribute FUNCTION DIRECTLY. USE THE setControlValueSelector INSTEAD.
 */


export default function NumSlide({ control, control_id }: { control: SliderControl<any> | null, control_id: number }) {
  const setValue = useStore(setControlValueSelector(control_id));
  const getValue = useControlValueSelector(control_id);

  if (!control) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Control {control_id}</h3>
      <div className="relative pt-1">
        <input
          type="range"
          min={control.range[0]}
          max={control.range[1]}
          step={control.step_size}
          value={getValue}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">{control.range[0]}</span>
          <span className="text-sm font-medium text-blue-600">{getValue.toFixed(2)}</span>
          <span className="text-sm text-gray-600">{control.range[1]}</span>
        </div>
      </div>
      <style jsx>{`
        input[type=range] {
          -webkit-appearance: none;
          margin: 10px 0;
          width: 100%;
        }
        input[type=range]:focus {
          outline: none;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          animate: 0.2s;
          background: #BFDBFE;
          border-radius: 4px;
        }
        input[type=range]::-webkit-slider-thumb {
          border: 2px solid #3B82F6;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -8px;
          transition: all 0.15s ease-in-out;
        }
        input[type=range]:focus::-webkit-slider-runnable-track {
          background: #93C5FD;
        }
        input[type=range]::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          animate: 0.2s;
          background: #BFDBFE;
          border-radius: 4px;
        }
        input[type=range]::-moz-range-thumb {
          border: 2px solid #3B82F6;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
        }
        input[type=range]:hover::-webkit-slider-thumb,
        input[type=range]:hover::-moz-range-thumb {
          transform: scale(1.1);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        input[type=range]:active::-webkit-slider-thumb,
        input[type=range]:active::-moz-range-thumb {
          background: #3B82F6;
        }
      `}</style>
    </div>
  );
}