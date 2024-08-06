import { useStore, getControlSelector } from "../store";
import { SliderControl } from "@/classes/SliderControl";
import NumSlider from "./NumSlider";
import { SelectControl } from "@/classes/SelectControl";
import { ShowSelect } from "./ShowSelect";
import { MultiChoiceClass } from "@/classes/MultiChoiceClass";
import MultiChoice from "./MultiChoice";

export default function ShowControl({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id));

  if (control instanceof SliderControl) {
    return <NumSlider control_id={control_id} />;
  } else if (control instanceof SelectControl) {
    return <ShowSelect control_id={control_id} />;
  } else if (control instanceof MultiChoiceClass) {
    return <MultiChoice control_id={control_id} />;
  } else {
    return null;
  }
}
