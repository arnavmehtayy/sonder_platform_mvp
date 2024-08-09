import { experience_regression, data_regression} from "./RidgeRegression";
import { Control } from "../Control";
import { obj } from "../obj";
import { Influence } from "../influence";
import { Vector2, Vector3 } from "three";

import { Score } from "../Score";
import Placement from "../Placement";

import Validation from "../Validation";

import Validation_test from "../Validation_test";

import { OrderItem } from "@/app/Components/OrderHandler";





export type data_type = {
  title: string;
  questions: string[];
  influencesData: Influence<any, any, any>[];
  controlData: Control[];
  canvasData: obj[];
  scoreData: Score<any>[];
  placement: Placement | null;
  validations: Validation[];
  order: OrderItem[];
};

export type experience_type = {
  name: string;
  slides: string[];
  description: string;
};

export const experiences: experience_type[] = [experience_regression];
export const initDataSets: { default: data_type, [key: string]: data_type } = {default: {
    title: "Question default",
    order: [{ type: "question", id: 0 }],
    questions: ["This is default", "This"],
    validations: [new Validation_test()],
    influencesData: [],
    controlData: [],
    canvasData: [],
    scoreData: [],
    placement: null,
  } , ...data_regression }