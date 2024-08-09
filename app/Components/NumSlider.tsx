
import {
  useStore,
  setControlValueSelector,
  useControlValueSelector, 
} from "../store";
import { SliderControl } from "@/classes/SliderControl";
import Latex from "react-latex-next";

export default function NumSlide({control_id }: { control_id: number }) {
  const setValue = useStore(setControlValueSelector(control_id));
  const getValue = useControlValueSelector(control_id);
  const control = useStore((state) => state.controls[control_id]) as SliderControl<any>;
  const isActive = control.isClickable
  if (!control) return null;


  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${!isActive ? 'opacity-50' : ''} relative`}>
      <h3 className="text-lg font-semibold text-blue-800 mb-2"><Latex> {control.desc} </Latex></h3>
      <p className=" text-gray-600 mb-2"> <Latex>{control.text}</Latex>  </p>
      <div className="relative pt-1">
        <input
          type="range"
          min={control.range[0]}
          max={control.range[1]}
          step={control.step_size}
          value={getValue}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          disabled={!isActive}

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
        }input[type=range]:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        input[type=range]:disabled::-webkit-slider-thumb {
          background: #ccc;
          border-color: #999;
          cursor: not-allowed;
        }
        input[type=range]:disabled::-moz-range-thumb {
          background: #ccc;
          border-color: #999;
          cursor: not-allowed;
        }
        input[type=range]:disabled:hover::-webkit-slider-thumb,
        input[type=range]:disabled:hover::-moz-range-thumb {
          transform: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}