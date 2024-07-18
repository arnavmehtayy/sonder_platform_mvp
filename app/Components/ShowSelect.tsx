import { useStore, getControlSelector } from "@/app/store";
import { SelectControl } from "@/classes/SelectControl";

export function ShowSelect({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id)) as SelectControl;
  if (control) {
    return <div>{control.selected.toString()}</div>;
  } else {
    return null;
  }
}
