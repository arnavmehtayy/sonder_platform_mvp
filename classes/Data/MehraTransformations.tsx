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
import { TableControl } from "../Controls/TableControl";
import { transform_atts } from "../vizobjects/get_set_obj_attributes";


export const experience_transforms1: experience_type = {
  name: "Introduction to Transformations",
  slides: [
    "function_points",
    "function_transformation_table",
    "function_transformation_slider",
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
const points_x_values = [-5, -3, 0, 2, 4];
const points_colors = ["blue", "red", "green", "yellow", "purple"];
const points_y_values_true = points_x_values.map((x) => func(x) + 10);
const points_y_values = points_x_values.map((x) => 0);
const points_true = points_x_values.map((x, i) => new Vector2(x, points_y_values_true[i]));
const points = points_x_values.map(
  (x, i) => new Vector2(x, points_y_values[i])
);
const point_vizobjects = [];
for (let i = 0; i < points.length; i++) {
  point_vizobjects.push(
    new geomobj({
      id: 2 + i,
      position: points[i],
      color: points_colors[i],
      geom: new THREE.CircleGeometry(),
      scale: new Vector3(0.8, 0.8, 1),
    })
  );
}
const points_vizobjects_true = []

for (let i = 0; i < points.length; i++) {
    points_vizobjects_true.push(
      new geomobj({
        id: 2 + i,
        position: points_true[i],
        color: points_colors[i],
        geom: new THREE.CircleGeometry(),
        scale: new Vector3(0.8, 0.8, 1),
      })
    );
  }

const axis: CoordinateAxis = new CoordinateAxis({
  id: 0,
  name: "CoordinateAxis",
  axisLength: 200,
  color: "white",
  isEnabled: true,
  tickSpacing: 5,
  tickSize: 0.9,
  fontSize: 1.5,
  xLabel: "X",
  yLabel: "Y",
});

const func_plot = new FunctionPlot({
  id: 1,
  name: "FunctionPlot",
  func: func,
  color: "white",
  isEnabled: true,
});

const functionPointsTableControl = new TableControl<geomobj>({
    id: 100,
    desc: "Function Points Table",
    text: "Enter y-values for the given x-values for the function $f(x) = x^2$",
    rows: points_x_values.map((x, index) => ({
      cells: [
        {
          value: x,
          isStatic: true,
          transform_function: "x",
          set_attribute: (obj: geomobj, value: number) => {
            // const newObj = Object.assign(
            //     Object.create(Object.getPrototypeOf(obj)),
            //     obj
            //   );
            // newObj.position.y = value;

            // return newObj;
            return obj;
          },
          obj_id: 2 + index,
        },
        {
          value: 0,  // Initial y-value, to be filled by user
          isStatic: false,
          transform_function: "x",
          set_attribute: (obj: geomobj, value: number) => {
            const newObj = Object.assign(
                Object.create(Object.getPrototypeOf(obj)),
                obj
              );
            newObj.position.y = value;

            return newObj;
          },
          obj_id: 2 + index,
        },
      ],
    })),
    columnHeaders: ["x", "y"],
    rowHeaders: points_colors,
  });

export const data_transformation: { [key: string]: data_type } = {
  function_points: {
    order: [{ type: "question", id: 0 }, {type: "control", id: 100}],
    title: "Points on a Function",
    questions: [
      {
        id: 0,
        text: "Consider the function $f(x) = x^2$. Fill in the below table with the corresponding y-values for the given x-values.",
      },
    ],
    influencesData: [],
    controlData: [functionPointsTableControl ],
    canvasData: [func_plot, ...point_vizobjects, axis],
    scoreData: [],
    placement: [],
    validations: [
        new Validation_obj({
          obj_id: 2,
          answer: 25,
          get_attribute: (obj: TransformObj) => obj.position.y,
          error: 0.01,
          desc: "Validate y-value for x = -5",
        }),
        new Validation_obj({
          obj_id: 3,
          answer: 9,
          get_attribute: (obj: TransformObj) => obj.position.y,
          error: 0.01,
          desc: "Validate y-value for x = -3",
        }),
        new Validation_obj({
          obj_id: 4,
          answer: 0,
          get_attribute: (obj: TransformObj) => obj.position.y,
          error: 0.01,
          desc: "Validate y-value for x = 0",
        }),
        new Validation_obj({
          obj_id: 5,
          answer: 4,
          get_attribute: (obj: TransformObj) => obj.position.y,
          error: 0.01,
          desc: "Validate y-value for x = 2",
        }),
        new Validation_obj({
          obj_id: 6,
          answer: 16,
          get_attribute: (obj: TransformObj) => obj.position.y,
          error: 0.01,
          desc: "Validate y-value for x = 4",
        }),
      ],
    camera_zoom: 10,
  },







  function_transformation_table: {
    order: [{ type: "question", id: 0 }, { type: "control", id: 100 }, { type: "control", id: 200 }],
    title: "Function Transformation",
    questions: [
      {
        id: 0,
        text: "Consider the function $f(x) = x^2 + 10$. Fill in the table with the corresponding y-values for the given x-values.",
      },
    ],
    influencesData: [],
    controlData: [
      new TableControl<geomobj>({
        id: 100,
        desc: "Function Points Table",
        text: "Enter y-values for the given x-values for the function $f(x) = x^2 + 10$",
        rows: points_x_values.map((x, index) => ({
          cells: [
            {
              value: x,
              isStatic: true,
              transform_function: "x",
              set_attribute: (obj: geomobj, value: number) => obj,
              obj_id: 2 + index,
            },
            {
              value: 0,
              isStatic: false,
              transform_function: "x",
              set_attribute: (obj: geomobj, value: number) => {
                const newObj = Object.assign(
                  Object.create(Object.getPrototypeOf(obj)),
                  obj
                );
                newObj.position.y = value;
                return newObj;
              },
              obj_id: 2 + index,
            },
          ],
        }),


        
    
    ),
        columnHeaders: ["x", "y"],
        rowHeaders: points_colors,
      }),

      new EnablerControl({
        id: 200,
        desc: "Show Original Function",
        text: "Click to show/hide the original function $f(x) = x^2$",
        obj_ids: [1],
    })
    ],
    canvasData: [
      new CoordinateAxis({
        id: 0,
        name: "CoordinateAxis",
        axisLength: 200,
        color: "white",
        isEnabled: true,
        tickSpacing: 5,
        tickSize: 0.9,
        fontSize: 1.5,
        xLabel: "X",
        yLabel: "Y",
      }),
      ...point_vizobjects,
        new FunctionPlot({
            id: 1,
            name: "FunctionPlot",
            func: (x: number) => x ** 2,
            color: "white",
            isEnabled: false,
        }),
    ],
    scoreData: [],
    placement: [],
    validations: [
      new Validation_obj({
        obj_id: 2,
        answer: 35,
        get_attribute: (obj: TransformObj) => obj.position.y,
        error: 0.01,
        desc: "Validate y-value for x = -5",
      }),
      new Validation_obj({
        obj_id: 3,
        answer: 19,
        get_attribute: (obj: TransformObj) => obj.position.y,
        error: 0.01,
        desc: "Validate y-value for x = -3",
      }),
      new Validation_obj({
        obj_id: 4,
        answer: 10,
        get_attribute: (obj: TransformObj) => obj.position.y,
        error: 0.01,
        desc: "Validate y-value for x = 0",
      }),
      new Validation_obj({
        obj_id: 5,
        answer: 14,
        get_attribute: (obj: TransformObj) => obj.position.y,
        error: 0.01,
        desc: "Validate y-value for x = 2",
      }),
      new Validation_obj({
        obj_id: 6,
        answer: 26,
        get_attribute: (obj: TransformObj) => obj.position.y,
        error: 0.01,
        desc: "Validate y-value for x = 4",
      }),
    ],
    camera_zoom: 10,
  },



  function_transformation_slider: {
    order: [
      { type: "question", id: 0 },
      { type: "control", id: 102 },
      {type: "control", id: 103}
    ],
    title: "Function Transformation: Vertical Shift",
    questions: [
      {
        id: 0,
        text: "Observe the transformed x-y points plotted on the graph from the previous slide. Use the sliders to transform the function $f(x) = x^2$ to $f(x) = x^2 + 10$.",
      },
    ],
    influencesData: [],
    controlData: [
      new SliderControl({
        id: 102,
        obj_id: 2,
        range: [-20, 20],
        step_size: 1,
        get_attribute: (obj: FunctionPlot) => obj.position.y,
        set_attribute: (obj: FunctionPlot, value: number) => {
          const newObj = Object.assign(
            Object.create(Object.getPrototypeOf(obj)),
            obj
          );
          newObj.position.y = value;
          return newObj;
        },
        desc: "Vertical Shift",
        text: "Move the slider to shift the function vertically",
      }),
      new SliderControl({
        id: 103,
        obj_id: 2,
        range: [-20, 20],
        step_size: 1,
        get_attribute: (obj: FunctionPlot) => obj.position.x,
        set_attribute: (obj: FunctionPlot, value: number) => {
          const newObj = Object.assign(
            Object.create(Object.getPrototypeOf(obj)),
            obj
          );
          newObj.position.x = value;
          return newObj;
        },
        desc: "Horizontal Shift",
        text: "Move the slider to shift the function horizontally",
      }),
    ],
    canvasData: [
        ...points_vizobjects_true,
      new CoordinateAxis({
        id: 0,
        name: "CoordinateAxis",
        axisLength: 200,
        color: "white",
        isEnabled: true,
        tickSpacing: 5,
        tickSize: 0.9,
        fontSize: 1.5,
        xLabel: "X",
        yLabel: "Y",
      }),
      new FunctionPlot({
        id: 1,
        name: "Original Function",
        func: (x: number) => x ** 2,
        color: "blue",
        isEnabled: false,
      }),
      new FunctionPlot({
        id: 2,
        name: "Transformed Function",
        func: (x: number) => x ** 2,
        color: "red",
        isEnabled: true,
      }),
    ],
    scoreData: [],
    placement: [],
    validations: [
      new Validation_obj({
        obj_id: 2,
        answer: 10,
        get_attribute: (obj: TransformObj) => obj.position.y,
        error: 0.1,
        desc: "Validate vertical shift of the transformed function",
      }),
    ],
    camera_zoom: 10,
  },




  
};
