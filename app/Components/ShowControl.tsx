import { useStore, getControlSelector } from "../store";
import { SliderControl } from "@/classes/Controls/SliderControl";

import { SelectControl } from "@/classes/Controls/SelectControl";

import { MultiChoiceClass } from "@/classes/Controls/MultiChoiceClass";

import { EnablerControl } from "@/classes/Controls/EnablerControl";
import { InputNumber } from "@/classes/Controls/InputNumber";

/*
  Given a control_id returns the UI for the relevant control
  Uses a useStore to fetch the control object corresponding to the control_id
*/

export default function ShowControl({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id));
  if (control) {
    return control.render();
  }

  // if (control instanceof SliderControl) {
  //   return <ShowNumSlider control_id={control_id} />;
  // } else if (control instanceof SelectControl) {
  //   return <ShowSelect control_id={control_id} />;
  // } else if (control instanceof MultiChoiceClass) {
  //   return <ShowMultiChoice control_id={control_id} />;
  // } else if (control instanceof InputNumber) {
  //   return <ShowInputNumber control_id={control_id} />;
  // } else if (control instanceof EnablerControl) {
  //   return <ShowEnablerControl control_id={control_id} />;
  // } else {
  //   return null;
  // }
}
