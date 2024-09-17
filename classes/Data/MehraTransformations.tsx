import { Control } from "../Controls/Control";
import { obj } from "../vizobjects/obj";
import { Influence } from "../influence";
import { Vector2, Vector3 } from "three";
import * as att_funcs from "../attribute_funcs";
import { SliderControl } from "../Controls/SliderControl";
import { TouchControl } from "../Controls/TouchControl";
import * as THREE from "three";
import { LineObj } from "../vizobjects/Lineobj";
import { geomobj } from "../vizobjects/geomobj";
import { SelectControl } from "../Controls/SelectControl";
import { SlideContTrans } from "../Controls/SliderContTrans";
import { TransformObj } from "../vizobjects/transformObj";
import { Score } from "../Scores/Score";
import Placement from "../Placement";
import TextGeom from "../vizobjects/textgeomObj";
import CoordinateAxis from "../vizobjects/CoordinateAxis";
import Validation from "../Validation/Validation";
import Validation_obj from "../Validation/Validation_obj";
import Validation_test from "../Validation/Validation_test";
import Validation_select from "../Validation/Validation_select";
import Validation_score from "../Validation/Validation_score";
import { MultiChoiceClass } from "../Controls/MultiChoiceClass";
import { ValidationMultiChoice } from "../Validation/ValidationMultiChoice";
import { InputNumber } from "../Controls/InputNumber";
import { Validation_inputNumber } from "../Validation/Validation_inputNumber";
import { init } from "next/dist/compiled/webpack/webpack";
import FunctionPlot from "../vizobjects/FunctionPlot";

import { EnablerControl } from "../Controls/EnablerControl";
import { seededRandom } from "three/src/math/MathUtils.js";

import { data_type, experience_type } from "./CompleteData";
import { DummyDataStorage } from "../vizobjects/DummyDataStore";
import { objectScorer } from "../Scores/objectScorer";
import { getScore } from "@/app/store";
import test from "node:test";

export const experience_transforms1: experience_type = {
  name: "Introduction to Transformations",
  slides: [
    "points_on_function",
    //   "intro_lin_reg",
    //   "lin_reg_flaw",
    //   "ridge_regression",
    //   "ridge_regression_2",
    //   "ridge_regression_fail",
  ],
  description:
    "In this experience, you will learn about function transformations.",
};

const func = (x: number) => {
  return x ** 2;
};
const func_string = "x^2";
const func_string_latex = "$x^2$";
const points_x_values = [1, 3, 5, 8, 10];
const points_colors = ["blue", "red", "green", "yellow", "purple"];
const points_y_values = points_x_values.map((x) => func(x));
const points = points_x_values.map(
  (x, i) => new Vector2(x, points_y_values[i])
);
const point_vizobjects = [];
for (let i = 0; i < points.length; i++) {
  point_vizobjects.push(
    new geomobj({
      id: 2+i,
      position: points[i],
      color: points_colors[i],
      geom: new THREE.CircleGeometry(),
      scale: new Vector3(0.3, 0.3, 1),
    })
  );
}

const axis: CoordinateAxis = new CoordinateAxis({
    id: 0,
    name: "CoordinateAxis",
    axisLength: 60,
    color: "white",
    isEnabled: true,
});

const func_plot = new FunctionPlot({
    id: 1,
    name: "FunctionPlot",
    func: func,
    color: "white",
    isEnabled: true,
    });

export const data_transformation: { [key: string]: data_type } = {
  points_on_function: {
    order: [],
    title: "Transformation",
    questions: [],
    influencesData: [],
    controlData: [],
    canvasData: [axis, func_plot, ...point_vizobjects],
    scoreData: [],
    placement: [],
    validations: [new Validation_test()],
  },
};
