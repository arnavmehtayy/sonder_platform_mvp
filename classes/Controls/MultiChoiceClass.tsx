import { Control } from "./Control";
import { Option } from "@/app/Components/ShowControls/ShowMultiChoice";


/*
 * This class is responsible for storing information about a multiple choice question
 * the attributes of this class are: options, isMultiSelect, selectedOptions
 */

export class MultiChoiceClass extends Control {
  options: Option[]; // the options of the multiple choice question
  isMultiSelect: boolean; // whether the multiple choice question allows multi option select or not
  selectedOptions: number[]; // the options that are currently selected for the multiple choice question

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
    this.selectedOptions = []; // no options are selected initially
  }

  // change the selected options of the multiple choice question used by the storage system
  setOptions(options: number[]) { 
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.selectedOptions = options;
    return new_obj;
  }

}
