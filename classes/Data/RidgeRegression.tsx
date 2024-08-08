import { Control } from "../Control";
import { obj } from "../obj";
import { Influence } from "../influence";
import { Vector2, Vector3 } from "three";
import * as att_funcs from "../attribute_funcs";
import { SliderControl } from "../SliderControl";
import { TouchControl } from "../TouchControl";
import * as THREE from "three";
import { LineObj } from "../Lineobj";
import { geomobj } from "../geomobj";
import { SelectControl } from "../SelectControl";
import { SlideContTrans } from "../SliderContTrans";
import { TransformObj } from "../transformObj";
import { Score } from "../Score";
import Placement from "../Placement";
import TextGeom from "../textgeom";
import CoordinateAxis from "../CoordinateAxis";
import Validation from "../Validation";
import Validation_obj from "../Validation_obj";
import Validation_test from "../Validation_test";
import Validation_select from "../Validation_select";
import Validation_score from "../Validation_score";
import { MultiChoiceClass } from "../MultiChoiceClass";
import { ValidationMultiChoice } from "../ValidationMultiChoice";
import { InputNumber } from "../InputNumber";
import { Validation_inputNumber } from "../Validation_inputNumber";
import { init } from "next/dist/compiled/webpack/webpack";
import FunctionPlot from "../FunctionPlot";
import { OrderItem } from "@/app/Components/OrderHandler";
import { EnablerControl } from "../EnablerControl";
import { seededRandom } from "three/src/math/MathUtils.js";

import { data_type, experience_type } from "../init_datasets";

const num_points = 30;
const num_new_points = 5;

const points_tech_companies = [
  // new Vector2(1.5,14),
  // new Vector2(1.7, 16),
  // new Vector2(1.2, 13),
  // new Vector2(2.0, 17),
  // new Vector2(2.1, 19),
  // new Vector2(1.2, 13),
  // new Vector2(1.1, 18),
  // new Vector2(1.0, 12),
  // new Vector2(1.8, 15),
  // new Vector2(1.2, 12),
];
for (let i = 0; i < 25; i++) {
  points_tech_companies.push(
    new Vector2(
      0.7 + (i / 15) * 2 * seededRandom(i),
      10 + 2 * seededRandom(i) + (i / 15) * 2
    )
  );
}
const new_points = [];
const points = [];
for (let i = 0; i < num_points; i++) {
  const x = i / 6;
  const y = 1 + (2 * i + 40 * seededRandom(i)) / 6; // Add noise to the y-values
  points.push(new Vector2(4 + x, y));
}

for (let i = 0; i < num_new_points; i++) {
  new_points.push(
    new Vector2(5.2 + i / 2, 2 + (26 * (i / 3) + 100 * seededRandom(i)) / 20)
  ); // Add noise to the new points
}

const tech_influences: Influence<any, any, any>[] = [];
const influences: Influence<any, any, any>[] = [];
const point_objs: geomobj[] = [];
const new_point_objs: geomobj[] = [];
const MSE_lines: { [key: number]: LineObj } = {};
const pointobjs_tech_companies = [];
const MSE_tech_companies: { [key: number]: LineObj } = {};

const newPointsEnablerControl = new EnablerControl({
  control_id: 3,
  desc: "New companies",
  text: "Click to reveal new the data for 5 new companies",
  obj_ids: [60, 61, 62, 63, 64],
});

const slope_control = new SliderControl<LineObj>({
  desc: "Slope",
  text: "move this slider to adjust the slope of the line",
  id: 1,
  obj_id: 1000,
  range: [-1, 10],
  step_size: 0.01,
  set_attribute: att_funcs.set_slope,
  get_attribute: att_funcs.get_slope,
});
const intercept_control = new SliderControl<LineObj>({
  desc: "Intercept",
  text: "move this slider to adjust the y-intercept of the line",
  id: 2,
  obj_id: 1000,
  range: [-15, 1],
  step_size: 0.01,
  set_attribute: att_funcs.set_intercept,
  get_attribute: att_funcs.get_intercept,
});

const CoordinateAxisObj = new CoordinateAxis({
  id: 99999,
  xLabel: "Revenue in Millions",
  yLabel: "Stock Price",
});

let reg_line: LineObj = new LineObj({
  id: 1000,
  start: new Vector2(0, 0),
  end: new Vector2(0, 0),
  line_width: 5,
  color: "red",
});
reg_line = LineObj.set_slope_intercept(reg_line, 0, 0.3, [-30, 30]);

const reg_line2 = LineObj.set_slope_intercept(reg_line, 0, 3.15, [-30, 30]);

const reg_line3 = LineObj.set_slope_intercept(reg_line, -7.4, 0, [-30, 30]);

for (let i = 0; i < num_new_points; i++) {
  new_point_objs.push(
    new geomobj({
      id: i + 60,
      geom: new THREE.CircleGeometry(0.23, 128),
      position: new_points[i],
      color: "rgb(0,255,40)",
      isEnabled: false,
    })
  );
}

for (let i = 0; i < num_points; i++) {
  point_objs.push(
    new geomobj({
      id: i,
      geom: new THREE.CircleGeometry(0.23, 128),
      position: points[i],
      color: "white",
    })
  );

  MSE_lines[i + num_points] = new LineObj({
    id: i + num_points,
    start: points[i],
    end: new Vector2(0, 0),
    line_width: 3,
    color: "gray",
  });

  for (let i = 0; i < points_tech_companies.length; i++) {
    pointobjs_tech_companies.push(
      new geomobj({
        id: 65 + i,
        geom: new THREE.CircleGeometry(0.23, 128),
        position: points_tech_companies[i],
        color: "violet",
      })
    );
  }

  for (let i = 0; i < points_tech_companies.length; i++) {
    MSE_tech_companies[i + 65 + points_tech_companies.length] = new LineObj({
      id: i + 65 + points_tech_companies.length,
      start: points_tech_companies[i],
      end: new Vector2(0, 0),
      line_width: 1.5,
      color: "gray",
    });

    tech_influences.push(
      new Influence<any, LineObj, LineObj>({
        influence_id: i,
        master_id: 1000,
        worker_id: i + 65 + points_tech_companies.length,
        transformation: (value, worker, master) => {
          const slope = value.y;
          const intercept = value.x;
          const x = worker.start.x;
          const y = worker.start.y;
          let perp_slope = 0;
          if (slope != 0) {
            perp_slope = -1 / slope;
          }
          const b = y - perp_slope * x;
          let new_x = worker.start.x;
          if (slope != 0) {
            new_x = (b - intercept) / (slope - perp_slope);
          }
          const new_y = slope * new_x + intercept;
          return new Vector2(new_x, new_y);
        },
        get_attribute: att_funcs.get_slope_intercept,
        set_attribute: att_funcs.set_end_point,
      })
    );
  }
  influences.push(
    new Influence<any, LineObj, LineObj>({
      influence_id: i,
      master_id: 1000,
      worker_id: i + num_points,
      transformation: (value, worker, master) => {
        const slope = value.y;
        const intercept = value.x;
        const x = worker.start.x;
        const y = worker.start.y;
        let perp_slope = 0;
        if (slope != 0) {
          perp_slope = -1 / slope;
        }
        const b = y - perp_slope * x;
        let new_x = worker.start.x;
        if (slope != 0) {
          new_x = (b - intercept) / (slope - perp_slope);
        }
        const new_y = slope * new_x + intercept;
        return new Vector2(new_x, new_y);
      },
      get_attribute: att_funcs.get_slope_intercept,
      set_attribute: att_funcs.set_end_point,
    })
  );
}

export const experience_regression: experience_type = {
  name: "Bias Variance Tradeoff and Linear Regression",
  slides: ["intro_lin_reg", "lin_reg_flaw", "ridge_regression"],
  description:
    "In this experience, you will learn Ridge Regression, a modification to the standard line of best fit model that is designed to be more robust against outliers.",
};

export const data_regression: { [key: string]: data_type } = {
  intro_lin_reg: {
    order: [
      { type: "question", id: 0 },
      { type: "score", id: 0 },
      { type: "control", id: 0 },
      { type: "question", id: 1 },
      { type: "score", id: 0 },
      { type: "control", id: 1 },
      { type: "control", id: 2 },
      { type: "question", id: 2 },
      { type: "control", id: 3 },
      { type: "control", id: 4 },
    ],
    title: "Introduction to Linear Regression",
    questions: [
      `
        We are studying the relationship between a company's average stock price and its revenue over a year using data from 30 companies. 

        <br> <br> 
        We observe a linear relationship and fit a line to this data. We evaluate how well the line fits by calculating the score:

        \\[
            \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2
        \\]

        where \\( \\text{dist}(\\text{line}, (x_i, y_i)) \\) is the shortest distance from the line to each point \\( (x_i, y_i) \\). In the diagram, the grey lines represent these distances.
        <br> <br>

        In simpler terms, we look at the 30 points on the graph, measure the distance from each point to the line, square these distances, and then add them all up.`,
      `Adust the slope and intercept of the line to achieve the optimal score.`,
      `We received information on 5 new companies yesterday, and we are going to use this to validate our line.`,
    ],
    validations: [
      new Validation_score<number, obj>({
        target_score: 25,
        relation: "<=",
        score_id: 0,
        comparator: (a, b) => a - b,
        error: 0,
        desc: "Score less than 25",
      }),
      new ValidationMultiChoice({
        control_id: 0,
        answer: [3],
        desc: "MCQ 1",
      }),
      new ValidationMultiChoice({
        control_id: 4,
        answer: [1],
        desc: "MCQ 2",
      }),
    ],
    influencesData: influences,
    controlData: [
      new MultiChoiceClass({
        id: 0,
        isMultiSelect: false,
        isClickable: true,
        title: "Score Goal",
        description: `What value should we aim to achieve as our score in order to 'fit' our line to the data?`,
        options: [
          { id: 1, label: "A really large positive number" },
          { id: 2, label: "A really large negative number" },
          { id: 3, label: "0" },
          { id: 4, label: "A constant value that is not 0" },
        ],
      }),
      slope_control,
      intercept_control,
      newPointsEnablerControl,

      new MultiChoiceClass({
        id: 4,
        title: "New Data",
        description:
          "In hindsight, do you think the line we fit predicts this new data?",
        options: [
          { id: 1, label: "Yes" },
          { id: 2, label: "No" },
        ],
        isMultiSelect: false,
        isClickable: true,
      }),
    ],
    canvasData: [
      ...Object.values(MSE_lines),
      reg_line,
      CoordinateAxisObj,
      ...point_objs,
      ...new_point_objs,
    ],
    scoreData: [
      new Score<number, LineObj>({
        text: "Line Score",
        score_id: 0,
        obj_id_list: [...Object.keys(MSE_lines).map(Number)],
        get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
        to_string: (val) => (Math.round(val * 10) / 10).toString(),
        transformation: (vals) => {
          let sum: number = 0;
          for (let i = 0; i < vals.length; i++) {
            sum += vals[i];
          }
          return sum;
        },
      }),
    ],
    placement: null,
  },

  lin_reg_flaw: {
    title: "A Flaw in our Score",
    order: [
      { type: "question", id: 0 },
      { type: "question", id: 1 },
      { type: "score", id: 0 },

      { type: "control", id: 2 },
      { type: "question", id: 2 },
      { type: "control", id: 3 },
      { type: "control", id: 4 },
    ],
    questions: [
      "We realized that we initially overlooked data for a few companies. We've now included them in the plot, highlighted in pink. These companies are have inflated stock prices because their buisnesses hold significant future potential.",
      `We have fixed the slope of the line. Adust the intercept of the line to achieve the optimal score. Adjust to a score of under 155.`,
      "We use the 5 new companies to validate our line once again.",
    ],
    validations: [
      new Validation_score<number, obj>({
        target_score: 155,
        relation: "<=",
        score_id: 0,
        comparator: (a, b) => a - b,
        error: 0,
        desc: "Score less than 155",
      }),
      new ValidationMultiChoice({
        control_id: 4,
        answer: [2],
        desc: "MCQ 1",
      }),
    ],
    influencesData: [...influences, ...tech_influences],
    controlData: [
      intercept_control,
      newPointsEnablerControl,
      new MultiChoiceClass({
        id: 4,
        title: "New Data",
        description:
          "In hindsight, do you think the line we fit predicts this new data?",
        options: [
          { id: 1, label: "Yes" },
          { id: 2, label: "No" },
        ],
        isMultiSelect: false,
        isClickable: true,
      }),
    ],
    canvasData: [
      ...Object.values(MSE_lines),
      ...Object.values(MSE_tech_companies),
      ...pointobjs_tech_companies,
      reg_line2,
      CoordinateAxisObj,
      ...point_objs,
      ...new_point_objs,
    ],
    scoreData: [
      new Score<number, LineObj>({
        text: "Line Score",
        score_id: 0,
        obj_id_list: [
          ...Object.keys(MSE_lines).map(Number),
          ...Object.keys(MSE_tech_companies).map(Number),
        ],
        get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
        to_string: (val) => (Math.round(val * 10) / 10).toString(),
        transformation: (vals) => {
          let sum: number = 0;
          for (let i = 0; i < vals.length; i++) {
            sum += vals[i];
          }
          return sum;
        },
      }),
    ],
    placement: null,
  },

  ridge_regression: {
    title: "Fighting the Outliers",
    questions: [
      `The pink companies are rare, making them special cases we don't often encounter, known as outliers. A savvy team member recommended a modification to our scoring method that is better suited to handling outliers.
        \\[
            \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2  + \\lambda \\cdot \\text{slope}^2
        \\]

        the only change that we make is the addition of the $\\lambda \\cdot \\text{slope}^2$ term `,
        `We have fixed the intercept of the line this time. Adust the slope of the line to achieve the optimal score. Adjust to a score of under ___.`,
    ],
    order: [{ type: "question", id: 0 },
        { type: "score", id: 0 },
        { type: "score", id: 1},
        { type: "question", id: 1 },
        { type: "control", id: slope_control.id },
        
        
    ],
    validations: [new Validation_test()],
    influencesData: [...influences, ...tech_influences],
    controlData: [slope_control, newPointsEnablerControl],
    canvasData: [
      ...Object.values(MSE_lines),
      ...Object.values(MSE_tech_companies),
      ...pointobjs_tech_companies,
      reg_line3,
      CoordinateAxisObj,
      ...point_objs,
      ...new_point_objs,
    ],
    scoreData: [
      new Score<number, LineObj>({
        text: "Old Line Score",
        score_id: 0,
        obj_id_list: [
          ...Object.keys(MSE_lines).map(Number),
          ...Object.keys(MSE_tech_companies).map(Number),
        ],
        get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
        to_string: (val) => (Math.round(val * 10) / 10).toString(),
        transformation: (vals) => {
          let sum: number = 0;
          for (let i = 0; i < vals.length; i++) {
            sum += vals[i];
          }
          return sum;
        },
      }),
      new Score<number, LineObj>({
        text: "New Score term",
        score_id: 1,
        obj_id_list: [reg_line3.id],
        get_attribute: (obj: LineObj) => att_funcs.get_slope_intercept(obj).y,
        to_string: (val) => (Math.round(val * 100) / 100).toString(),
        transformation: (vals) => {
          return vals[0] ** 2;
        },
      }),
    ],
    placement: null,
  },
};
