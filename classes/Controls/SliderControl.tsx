import { obj } from "../vizobjects/obj";
import { Control } from "./Control";
import { useStore, setSliderControlValueSelector, getSliderControlValueSelector } from "@/app/store";
import React from 'react';
import Latex from 'react-latex-next';

/*
 *  This is the class that holds information about the slider control
  *  The slider control is used to change the value of an attribute of an object using a number slider
  * the attributes of this class are: 
  * obj_id (object who the control is controlling)
  * range, step_size, 
  * get_attribute (function to get the attribute of the object that the control is controlling),
  * set_attribute (function to set the attribute of the object that the control is controlling)
*/
// This class is the base class used to create a slider control for any object in the scene

export function ShowSliderControl({control} : {control: SliderControl<any>}) {
  const setValue = useStore(setSliderControlValueSelector(control.id));
    const getValue = useStore(getSliderControlValueSelector(control.id));

    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${!control.isClickable ? "opacity-50" : ""} relative`}>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          <Latex>{control.desc}</Latex>
        </h3>
        <p className="text-gray-600 mb-2">
          <Latex>{control.text}</Latex>
        </p>
        <div className="relative pt-1">
          <input
            type="range"
            min={control.range[0]}
            max={control.range[1]}
            step={control.step_size}
            value={getValue}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            disabled={!control.isClickable}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">{control.range[0]}</span>
            <span className="text-sm font-medium text-blue-600">
              {getValue.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">{control.range[1]}</span>
          </div>
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
        input[type="range"]:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        input[type="range"]:disabled::-webkit-slider-thumb {
          background: #ccc;
          border-color: #999;
          cursor: not-allowed;
        }
        input[type="range"]:disabled::-moz-range-thumb {
          background: #ccc;
          border-color: #999;
          cursor: not-allowed;
        }
        input[type="range"]:disabled:hover::-webkit-slider-thumb,
        input[type="range"]:disabled:hover::-moz-range-thumb {
          transform: none;
          box-shadow: none;
        }
      `}</style>
      </div>
      
    );
}

export class SliderControl<T extends obj> extends Control {
  obj_id: number; // This is the id of the object that the control is controlling
  range: [number, number];
  step_size: number;
  get_attribute: (obj: T) => number; // Function to get the attribute of the object
  set_attribute: (obj: T, value: number) => T; // Function to set the attribute of the object
  constructor({
    id,
    obj_id,
    range,
    step_size = 1,
    get_attribute = (obj: T) => {
      console.log("default SliderControl");
      return 0;
    },
    set_attribute = (obj: T, value: number) => {
      console.log("default SliderControl");
      return obj;
    },
    desc = "slider control",
    text = "this is a slider control",
  }: Partial<SliderControl<T>> & {
    id: number;
    obj_id: number;
    range: [number, number];
  }) {
    super({ id: id, desc, text: text });
    this.obj_id = obj_id;
    this.range = range;
    this.step_size = step_size;
    this.get_attribute = get_attribute;
    this.set_attribute = set_attribute;
  }

  // method to get the value of the slider control given the instance of the object that the control is controlling
  getSliderValue(obj: T): number { 
    if (obj) {
      return this.get_attribute(obj as T);
    } else {
      return 0;
    }
  }

  // method that returns a new object of the controller object with the attribute set to the relevant value
  setSliderValue(obj: T, value: number): T {
    if (obj) {
      return this.set_attribute(obj as T, value);
    } else {
      return obj;
    }
  }

  render(): React.ReactNode {
    return <ShowSliderControl control={this} />;
    // const setValue = useStore(setSliderControlValueSelector(this.id));
    // const getValue = useStore(getSliderControlValueSelector(this.id));

    // return (
    //   <div className={`bg-white rounded-lg shadow-md p-4 ${!this.isClickable ? "opacity-50" : ""} relative`}>
    //     <h3 className="text-lg font-semibold text-blue-800 mb-2">
    //       <Latex>{this.desc}</Latex>
    //     </h3>
    //     <p className="text-gray-600 mb-2">
    //       <Latex>{this.text}</Latex>
    //     </p>
    //     <div className="relative pt-1">
    //       <input
    //         type="range"
    //         min={this.range[0]}
    //         max={this.range[1]}
    //         step={this.step_size}
    //         value={getValue}
    //         onChange={(e) => setValue(Number(e.target.value))}
    //         className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
    //         disabled={!this.isClickable}
    //       />
    //       <div className="flex justify-between items-center mt-2">
    //         <span className="text-sm text-gray-600">{this.range[0]}</span>
    //         <span className="text-sm font-medium text-blue-600">
    //           {getValue.toFixed(2)}
    //         </span>
    //         <span className="text-sm text-gray-600">{this.range[1]}</span>
    //       </div>
    //     </div>
    //   </div>
    // );
  }
}
