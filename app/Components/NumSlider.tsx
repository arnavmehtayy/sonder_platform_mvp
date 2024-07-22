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

export default function NumSlide({control, control_id }: { control: SliderControl<any> | null, control_id: number }) {
  const setValue = useStore(setControlValueSelector(control_id)); // function that sets the value of a control given its control_id
  const getValue = useControlValueSelector(control_id); // gets the value associated with the control based on the control_id

  // TESTING
  // const influence = useStore(getInfluenceSelector(controller.obj_id));
  // const setObj = useStore(setVizObjSelector);
  // const master = useStore(getObjectSelector(controller.obj_id));
  // let worker = null
  // if (influence) {
  //   worker = useStore(getObjectSelector(influence.worker_id));
  // }


  return control ? (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">Control {control_id}</h3>
      <input
        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        type="range"
        min={control?.range[0].toString()}
        max={control?.range[1].toString()}
        step={control.step_size}
        value={getValue}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-600">{control?.range[0]}</span>
        <span className="text-sm font-medium text-blue-600">{getValue}</span>
        <span className="text-sm text-gray-600">{control?.range[1]}</span>
      </div>
    </div>
  ) : null;
}
