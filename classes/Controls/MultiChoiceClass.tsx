import { Control } from "./Control";
import { Option } from "@/app/Components/ShowControls/ShowMultiChoice";

export class MultiChoiceClass extends Control {
  options: Option[];
  isMultiSelect: boolean;
  selectedOptions: number[];

  constructor({
    id,
    title,
    description,
    isClickable = true,
    options,
    isMultiSelect = false,
  }: Partial<MultiChoiceClass> & {
    id: number;
    title: string;
    description: string;
    options: Option[];
  }) {
    super({ id, desc: title, text: description, isClickable });
    this.options = options;
    this.isMultiSelect = isMultiSelect;
    this.selectedOptions = [];
  }

  setOptions(options: number[]) {
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.selectedOptions = options;
    return new_obj;
  }
}
