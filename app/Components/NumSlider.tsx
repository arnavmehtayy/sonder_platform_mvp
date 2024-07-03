import {
  useStore,
  setControlValueSelector,
  getControlSelector,
  getControlValueSelector,
} from "../store";

/*
  * This component is a number slider that allows the user to control a numerical value.
  * It takes in a control_id and renders a slider that controls using the setControlValueSelector
  * This will update the state of the object that the control is associated with.
  * DO NOT USE THE set_attribute FUNCTION DIRECTLY. USE THE setControlValueSelector INSTEAD.
*/

export default function NumSlide({ control_id }: { control_id: number }) {
  const setValue = useStore(setControlValueSelector); // function that sets the value of a control given its control_id
  // (control_id: number, valueToSet: number) => void;
  const getControl = useStore(getControlSelector); // get the control object based on its id
  const getValue = useStore(getControlValueSelector); // gets the value associated with the control based on the control_id

  const controller = getControl(control_id);

  return controller ? (
    <div
      className="flex justify-end"
      style={{ width: "300px", margin: "50px auto", textAlign: "center" }}
    >
      <input
        type="range"
        min={controller?.range[0].toString()}
        max={controller?.range[1].toString()}
        step={controller.step_size}
        value={getValue(control_id)}
        onChange={(e) => {
          setValue(control_id, Number(e.target.value));
        }}
        style={{ width: "100%" }}
      />
      <p>Value: {getValue(control_id)}</p>
    </div>
  ) : null;
}
