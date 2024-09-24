import { experience_regression, data_regression } from "./RidgeRegression";
import { experience_transforms1, data_transformation } from "./MehraTransformations";
import { Control } from "../Controls/Control";
import { obj } from "../vizobjects/obj";
import { Influence } from "../influence";
import { Vector2, Vector3 } from "three";

import { Score } from "../Scores/Score";
import Placement from "../Placement";

import Validation from "../Validation/Validation";

import Validation_test from "../Validation/Validation_test";

import { OrderItem } from "@/app/store";
import { InputNumber } from "../Controls/InputNumber";
import { EnablerControl } from "../Controls/EnablerControl";
import { MultiChoiceClass } from "../Controls/MultiChoiceClass";

export type data_type = {
  camera_zoom?: number;
  title: string;
  questions: {id: number, text: string}[];
  influencesData: Influence<any, any, any>[];
  controlData: Control[];
  canvasData: obj[];
  scoreData: Score<any>[];
  placement: Placement[];
  validations: Validation[];
  order: OrderItem[];
};

export type experience_type = {
  name: string;
  slides: string[];
  description: string;
};

export const experiences: experience_type[] = [experience_regression, experience_transforms1];
export const initDataSets: { default: data_type; [key: string]: data_type } = {
  default: {
    title: "Question default",
    order: [{ type: "question", id: 0}],
    questions: [{id: 0, text: "This is default"}, {id: 1, text: "This"}],
    validations: [new Validation_test({is_valid: true, desc: "default"})],
    influencesData: [],
    controlData: [
    ],
    canvasData: [],
    scoreData: [],
    placement: [],
  },
  ...data_regression,
  ...data_transformation
}; // this contains all the data that is transferred to the storage system
// [key: name of slide] => slide data
