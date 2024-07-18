import {
  useStore,
  setControlValueSelector,
  getControlSelector,
  getControlValueSelector,
  getInfluenceSelector,
  setVizObjSelector,
  getObjectSelector,
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

export default function NumSlide({ control_id }: { control_id: number }) {
  const setValue = useStore(useShallow(setControlValueSelector(control_id))); // function that sets the value of a control given its control_id
  const controller = useStore(useShallow(getControlSelector(control_id))) as SliderControl<any>; // get the control object based on its id
  const getValue = useStore(useShallow(getControlValueSelector(control_id))); // gets the value associated with the control based on the control_id

  // TESTING
  // const influence = useStore(getInfluenceSelector(controller.obj_id));
  // const setObj = useStore(setVizObjSelector);
  // const master = useStore(getObjectSelector(controller.obj_id));
  // let worker = null
  // if (influence) {
  //   worker = useStore(getObjectSelector(influence.worker_id));
  // }

  // console.log("Controller: ", control_id)

  return controller ? (
    <>
      <div
        className="flex flex-col items-center justify-center mx-auto my-12 space-y-4"
        style={{ width: "300px" }}
      >
        <input
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-900"
          type="range"
          min={controller?.range[0].toString()}
          max={controller?.range[1].toString()}
          step={controller.step_size}
          value={getValue}
          onChange={(e) => {
            setValue(Number(e.target.value));
            // if(influence && worker) {
            //   Influence.UpdateInfluenceManual(
            //     influence,
            //     setObj,
            //     worker,
            //     Number(e.target.value)
            //   );
              
            // }
          }}
        />
        <p className="text-lg font-semibold text-blue-600">Value: {getValue}</p>
      </div>
    </>
  ) : null;
}
