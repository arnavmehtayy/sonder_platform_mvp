import {
  useStore,
  setInteractobjvalueSelector,
  controlsSelector,
  InteraobjvalueSelector,
} from "../store";

export default function NumSlide({ control_id }: { control_id: number }) {
  const setValue = useStore(setInteractobjvalueSelector); // selects based on object id
  const getControl = useStore(controlsSelector); // selects based on control id
  const getValue = useStore(InteraobjvalueSelector); // selects based on object id

  const controller = getControl(control_id);

  return (
    controller ?
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
    </div> : null
  );
}
