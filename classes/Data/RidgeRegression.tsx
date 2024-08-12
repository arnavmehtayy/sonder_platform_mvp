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
import { OrderItem } from "@/app/Components/Sidebar/OrderHandler";
import { EnablerControl } from "../Controls/EnablerControl";
import { seededRandom } from "three/src/math/MathUtils.js";

import { data_type, experience_type } from "./CompleteData";
import { DummyDataStorage } from "../vizobjects/DummyDataStore";
import { objectScorer } from "../Scores/objectScorer";
import { getScore } from "@/app/store";

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
const lambda = new DummyDataStorage<number>({
  id: 9910,
  name: "data storage",
  data: 16,
});

const lambda_slider = new SliderControl<DummyDataStorage<number>>({
  id: 5,
  desc: "Lambda",
  text: "Move this slider to adjust the value of $\\lambda$",
  obj_id: 9910,
  range: [0, 100],
  step_size: 0.5,
  set_attribute: att_funcs.setDummyValue,
  get_attribute: att_funcs.getDummyValue,
});

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

let reg_ref_line: LineObj = new LineObj({
  id: 1001,
  start: new Vector2(0, 0),
  end: new Vector2(0, 0),
  line_width: 5,
  color: "#72FFAC",
});
reg_line = LineObj.set_slope_intercept(reg_line, 0, 0.3, [-30, 30]);

const outlier_placement_choices = [
  new Vector2(2, 14),
  new Vector2(14, 2),
  new Vector2(8, 10),
  new Vector2(4, 1),
];

const reg_line2 = LineObj.set_slope_intercept(reg_line, 0, 3.15, [-30, 30]);
const reg_line_4_ref = LineObj.set_slope_intercept(
  reg_ref_line,
  -7.2,
  2.5,
  [-30, 30]
);

const reg_line_2_ref = LineObj.set_slope_intercept(
  reg_ref_line,
  -7.5,
  3.15,
  [-30, 30]
);

const reg_line3 = LineObj.set_slope_intercept(reg_line, -7.4, 4, [-30, 30]);

let reg_line_3_ref = new LineObj({
  id: 1000,
  start: new Vector2(0, 0),
  end: new Vector2(0, 0),
  line_width: 5,
  color: "#72FFAC",
});
reg_line_3_ref = LineObj.set_slope_intercept(
  reg_line_3_ref,
  -7.2,
  2.5,
  [-30, 30]
);

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

// OUTLIERS

const outlier_positions = [
  new Vector2(1, 13),
  new Vector2(3, 16),
  new Vector2(16, 1),
  new Vector2(15, 3),
];
const outlier_objs = [];
for (let i = 0; i < outlier_positions.length; i++) {
  outlier_objs.push(
    new geomobj({
      id: 150 + i,
      geom: new THREE.CircleGeometry(0.23, 128),
      position: outlier_positions[i],
      color: "violet",
      name: `(${outlier_positions[i].x}, ${outlier_positions[i].y})`,
    })
  );
}

// OUTLIERS

// SCORE STUFF
const line_MSE_scorers = Object.keys(MSE_lines).map((key) => {
  return new objectScorer<LineObj>({
    id: parseInt(key),
    get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
  });
});
const line_MSE__tech_scorers = Object.keys(MSE_tech_companies).map((key) => {
  return new objectScorer<LineObj>({
    id: parseInt(key),
    get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
  });
});

const ridge_score = new Score<number>({
  text: "Old Score + New Score term",
  desc: `$ \\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2 + \\lambda \\cdot \\text{slope}^2 $`,
  score_id: 2,
  obj_list: [
    new objectScorer<LineObj>({
      id: reg_line3.id,
      get_attribute: (obj: LineObj) => att_funcs.get_slope_intercept(obj).y,
    }),
    new objectScorer<DummyDataStorage<number>>({
      id: 9910,
      get_attribute: (obj: DummyDataStorage<number>) => obj.data,
    }),
    ...line_MSE_scorers,
    ...line_MSE__tech_scorers,
  ],
  to_string: (val) => (Math.round(val * 100) / 100).toString(),
  transformation: (vals) => {
    let sum: number = 0;
    for (let i = 1; i < vals.length; i++) {
      sum += vals[i];
    }

    return sum + vals[0] ** 2 * vals[1];
  },
});

// SCORE STUFF

export const experience_regression: experience_type = {
  name: "Introduction to Ridge Regression",
  slides: [
    "intro_lin_reg",
    "lin_reg_flaw",
    "ridge_regression",
    "ridge_regression_2",
    "ridge_regression_fail",
  ],
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
        We observe a linear relationship and so we will endeavor to fit a line to this data. We use the following metric that scores how well the line fits the data points:

        \\[
            \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2
        \\]

        where \\( \\text{dist}(\\text{line}, (x_i, y_i)) \\) is the shortest distance from the line to each point \\( (x_i, y_i) \\). In the diagram, the grey lines represent these distances.
        <br> <br>

        In simpler terms, we look at the 30 points on the graph, measure the distance from each point to the line, square these distances, and then add them all up.`,
      `Adust the slope and intercept of the line to get as close to the optimal score as you can.`,
      `We received information on 5 new companies yesterday, and we will use this to validate our line.`,
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
        description: `What score value should we aim to achieve in order to 'fit' our line to the data?`,
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
          "In hindsight, do you think the line you fit predicts this new data?",
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
      new Score<number>({
        text: "Line Score",
        score_id: 0,
        obj_list: line_MSE_scorers,
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
      { type: "score", id: 0 },
      { type: "question", id: 1 },

      { type: "control", id: 2 },
      { type: "question", id: 2 },
      { type: "control", id: 3 },
      { type: "control", id: 4 },
    ],
    questions: [
      `Our team discovered that we overlooked data for 10 companies. We’ve now incorporated this information into the plot, highlighting these companies in pink. 
      <br> <br>
      Observe how these companies have stock prices that are disproportionately high relative to their revenue. <br> <br>
      The green line represents the line you identified in the previous section, which is the line of best fit for the data without considering the pink companies.
      <br> <br>
      We adjust our score to account for the addition of the pink data points to our analysis.
      
      \\[
            \\text{Score} = \\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2
    \\]
    Note that we have changed the sum from $\\sum_{i=1}^{30}$ to $\\sum_{i=1}^{40}$ to account for the 10 pink companies.
    <br> <br>
$\\textbf{Note}$ : The value of the score is irrelevant; our focus is solely on minimizing it.
    
        `,
      `For simplicity we have fixed the slope. Adust the intercept of the line to achieve the optimal score. The optimal score is under 155.`,
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
          "In hindsight, do you think our red line predicts this new data?",
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
      reg_line_4_ref,
    ],
    scoreData: [
      new Score<number>({
        text: "Line Score Including Pink Data",
        score_id: 0,
        obj_list: [...line_MSE_scorers, ...line_MSE__tech_scorers],
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
      `The pink companies are commonly known as outliers and they make our model unstable. A savvy team member recommended a modification to our scoring method that is better suited to handling outliers.
        \\[
            \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2  + \\lambda \\cdot \\text{slope}^2
        \\]

        The only modification is the addition of the      $\\lambda \\cdot \\text{slope}^2$ term. For now we set $\\lambda = 16$. We will address the choice of $\\lambda$ a little later<br> <br>
        The green line represents the line of best fit obtained in the previous part i.e. the line that minimizes the score that includes the pink companies. <br> <br>
        $\\textbf{Note}$: The value of the score is irrelevant; our focus is solely on minimizing it.`,
      `We have fixed the y-intercept of the line. Adust the slope of the line to achieve the optimal score. Adjust to a score of under 286.`,
      "Notice how our red line performs well on the new data. This modification to the score made our model more robust against outliers.",
    ],
    order: [
      { type: "question", id: 0 },
      { type: "score", id: 0 },
      { type: "score", id: 1 },
      { type: "score", id: 2 },
      { type: "question", id: 1 },
      { type: "control", id: slope_control.id },
      { type: "control", id: newPointsEnablerControl.id },
      { type: "question", id: 2 },
    ],
    validations: [
      new Validation_score<number, obj>({
        target_score: 286,
        relation: "<=",
        score_id: ridge_score.score_id,
        comparator: (a, b) => a - b,
        error: 0,
        desc: "Score less than 286",
      }),
    ],
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
      lambda,
      reg_line_2_ref,
    ],
    scoreData: [
      new Score<number>({
        text: "Old Score Including Pink Data",
        desc: `$\\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2$`,
        score_id: 0,
        obj_list: [...line_MSE_scorers, ...line_MSE__tech_scorers],
        to_string: (val) => (Math.round(val * 10) / 10).toString(),
        transformation: (vals) => {
          let sum: number = 0;
          for (let i = 0; i < vals.length; i++) {
            sum += vals[i];
          }
          return sum;
        },
      }),
      new Score<number>({
        text: "New Score term",
        desc: `$   \\lambda \\cdot \\text{slope}^2 $`,
        score_id: 1,
        obj_list: [
          new objectScorer<LineObj>({
            id: reg_line3.id,
            get_attribute: (obj: LineObj) =>
              att_funcs.get_slope_intercept(obj).y,
          }),
          new objectScorer<DummyDataStorage<number>>({
            id: 9910,
            get_attribute: (obj: DummyDataStorage<number>) => obj.data,
          }),
        ],
        to_string: (val) => (Math.round(val * 100) / 100).toString(),
        transformation: (vals) => {
          return vals[0] ** 2 * vals[1];
        },
      }),

      ridge_score,
    ],
    placement: null,
  },

  ridge_regression_2: {
    title: "A game of tug-of-war",
    order: [
      { type: "question", id: 0 },
      { type: "score", id: 0 },
      { type: "question", id: 1 },
      { type: "score", id: ridge_score.score_id },
      { type: "question", id: 2 },
      { type: "control", id: lambda_slider.id },
      { type: "control", id: slope_control.id },
      { type: "control", id: 4 },
      { type: "question", id: 3 },
    ],
    questions: [
      `This modification to the score is called Ridge Regression and it works well to correct the line in this case. <br> <br> However, a natural question to ask is: how do we choose $\\lambda$?:
            \\[
            \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2  + \\lambda \\cdot \\text{slope}^2
        \\] 
        <br>
         `,
      "Consider how $\\lambda$ affects the minimization of the above equation. Test your hypothesis by adjusting the sliders. After experimenting, proceed to answer the question below",
      `$\\textbf{Hint} $: First, examine the score equation and attempt to infer the purpose of the two terms. To test your hypothesis, set 
$\\lambda$ to a very large value, and adjust the line to minimize the score. Afterward, repeat the process with $\\lambda$ set to a very small value.
<br> <br> $\\textbf{Reminder}$: The value of the score is irrelevant; our focus is solely on minimizing it :`,
      `Notice that this is like a game of tug-of-war: the outliers are pulling the slope of the line higher to keep the first term of the score small, while the 
$\\lambda \\cdot \\text{slope}^2 $ term is pulling the slope lower to minimize the second term. These two forces are working in opposition. The ideal value for  $\\lambda $ depends on the specific problem, and finding the optimal value often involves a process of trial and error`,
    ],
    validations: [
      new ValidationMultiChoice({
        control_id: 4,
        answer: [1, 2],
        desc: "MCQ 1",
      }),
    ],
    influencesData: [...influences, ...tech_influences],
    controlData: [
      lambda_slider,
      new SliderControl<LineObj>({
        desc: "Slope",
        text: "move this slider to adjust the slope of the line",
        id: 1,
        obj_id: 1000,
        range: [-1, 10],
        step_size: 0.1,
        set_attribute: att_funcs.set_slope,
        get_attribute: att_funcs.get_slope,
      }),
      new MultiChoiceClass({
        id: 4,
        title: "The choice of $\\lambda$",
        description: "Choose all the options that are true",
        options: [
          {
            id: 1,
            label:
              "A greater value of $\\lambda$ tend to decrease the magnitude of the slope of the line",
          },
          {
            id: 2,
            label:
              "A smaller value of $\\lambda$ tend to amplify the influence of outliers on the slope of the line",
          },
          {
            id: 3,
            label:
              "If $\\lambda$ is set to 0 then the slope of the line tends to $0$",
          },
          {
            id: 4,
            label: "A larger value of $\\lambda$ is better in all situations",
          },
        ],
        isMultiSelect: true,
        isClickable: true,
      }),
    ],

    canvasData: [
      ...Object.values(MSE_lines),
      ...Object.values(MSE_tech_companies),
      ...pointobjs_tech_companies,
      CoordinateAxisObj,
      ...point_objs,
      ...new_point_objs,
      lambda,
      reg_line3,
    ],
    scoreData: [ridge_score],
    placement: null,
  },

  ridge_regression_fail: {
    title: "The Necessary Evil",
    order: [
      { type: "question", id: 0 },
      // { type: "score", id: ridge_score.score_id },
      { type: "question", id: 1 },
      { type: "control", id: 0 },
      { type: "control", id: 1 },
      { type: "question", id: 2 },
      { type: "control", id: 2 },
      { type: "question", id: 3 },
      { type: "placement", id: 0 },
    ],
    questions: [
      `Even if we succeed in selecting an optimal $ \\lambda $, this method is not foolproof. We will construct a scenario where ridge regression fails.

To recap, the goal of ridge regression is to adjust the slope and intercept of a line in order to minimize the following score:
\\[
\\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2 + \\lambda \\cdot \\text{slope}^2
\\]
For reference, the green line represents the true relation between the stock prices and revenue of a company. <br> <br>`,
      `Notice that we have added 4 pink outlier data points. Answer the below questions by selecting the relevant pink points.`,
      `As a reminder ridge regression is designed to penalize large slopes, but is penalizing large slopes always beneficial to control any outlier?`,
      `Select an outlier that would cause ridge regression to move the slope of the line in the wrong direction. A wrong direction is that which moves the line away from the true line`,
    ],
    validations: [
      new Validation_select({
        control_id: 0,
        answer: [outlier_objs[0].id, outlier_objs[1].id],
        desc: "2 outliers increase the slope",
      }),
      new Validation_select({
        control_id: 1,
        answer: [outlier_objs[2].id, outlier_objs[3].id],
        desc: "2 outliers decrease the slope",
      }),
      new Validation_obj<Vector2>({
        obj_id: 998,
        desc: "outlier placed correctly",
        answer: outlier_placement_choices[1],
        get_attribute: att_funcs.get_position,
      }),
      new ValidationMultiChoice({
        control_id: 2,
        answer: [1],
        desc: "MCQ 1",
      }),
    ],
    influencesData: [...influences],
    controlData: [
      new SelectControl({
        id: 0,
        selectable: [
          outlier_objs[0].id,
          outlier_objs[1].id,
          outlier_objs[2].id,
          outlier_objs[3].id,
        ],
        selected: [],
        text: "Select 2 outliers that tends to increase the slope of our green line of best fit",
        desc: "Click to Select",
        capacity: 2,
      }),
      new SelectControl({
        id: 1,
        selectable: [
          outlier_objs[0].id,
          outlier_objs[1].id,
          outlier_objs[2].id,
          outlier_objs[3].id,
        ],
        selected: [],
        text: "Select the 2 outlier that tends to decrease the slope of our line of best fit",
        desc: "Click to Select",
        capacity: 2,
      }),

      new MultiChoiceClass({
        id: 2,
        title: "Penalizing Large Slopes",
        description:
          "Do you think penalizing large slopes is always a good idea to control outliers?",
        options: [
          {
            id: 1,
            label:
              "No - penalizing large slopes does not work if the outliers lie below the true line",
          },
          {
            id: 3,
            label:
              "No - penalizing large slopes does not work if the outliers lie above the true line",
          },
          {
            id: 2,
            label: "Yes - penalizing large slopes is always beneficial",
          },
        ],
        isMultiSelect: false,
        isClickable: true,
      }),
    ],
    canvasData: [
      ...Object.values(MSE_lines),
      reg_line_3_ref,
      CoordinateAxisObj,
      ...point_objs,
      lambda,
      ...outlier_objs,

      //   new geomobj({
      //     id: 999,
      //     geom: new THREE.CircleGeometry(0.23, 128),
      //     position: new Vector2(0, 0),
      //     color: "#72FFAC",
      //   }),
    ],
    scoreData: [],
    placement: new Placement({
      grid: [0, 0],
      cellSize: 0,

      gridVectors: outlier_placement_choices,
      object_ids: [998],
      geometry: new THREE.CircleGeometry(0.23, 128),
      color: "violet",
    }),
  },
};
