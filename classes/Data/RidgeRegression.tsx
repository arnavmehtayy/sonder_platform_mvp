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
  text: "Move this slider to adjust the $\\textbf{value of $\\lambda$}$",
  obj_id: 9910,
  range: [0, 100],
  step_size: 0.5,
  set_attribute: att_funcs.setDummyValue,
  get_attribute: att_funcs.getDummyValue,
});

const newPointsEnablerControl = new EnablerControl({
  control_id: 3,
  desc: "New companies",
  text: "$\\textbf{Click to reveal}$ the new data for 5 new companies",
  obj_ids: [60, 61, 62, 63, 64],
});

const slope_control = new SliderControl<LineObj>({
  desc: "Slope",
  text: "$\\textbf{move}$ this slider to adjust the $\\textbf{slope}$ of the line",
  id: 1,
  obj_id: 1000,
  range: [-1, 10],
  step_size: 0.01,
  set_attribute: att_funcs.set_slope,
  get_attribute: att_funcs.get_slope,
});
const intercept_control = new SliderControl<LineObj>({
  desc: "Intercept",
  text: "$\\textbf{move}$ this slider to adjust the $\\textbf{y-intercept}$ of the line",
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
      color: "rgb(0,200,25)",
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
      geom: new THREE.CircleGeometry(0.3, 128),
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
  text: "Ridge Score",
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
      {id: 0, text:`
        We are studying the relationship between a company's average stock price and its revenue using data from 30 companies. 

        <br> <br> 
        We notice a linear relationship, so we'll try to fit a line to this data. To measure how well the line fits, we use the following score:

        \\[
            \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2
        \\]

        where \\( \\text{dist}(\\text{line}, (x_i, y_i)) \\) is the shortest distance from the line to each point \\( (x_i, y_i) \\). The grey lines in the diagram represent these distances.
        <br> <br>

        Simply put, we measure the distance from each of the 30 points to the line, square these distances, and add them up.
        <br> <br>
        $\\textbf{Observe} $ : Adjusting the line will change the score because changing the line alters the distances between the points and the line.
        `},
      {id: 1, text: `$\\textbf{Adjust the slope and intercept}$ of the line to get as close to the optimal score as possible.`},
      {id: 2, text: `We use $\\textbf{5 new data points}$ to check the validity of our line.`},
    ],
    validations: [
      new Validation_score<number, obj>({
        target_score: 25,
        relation: "<=",
        score_id: 0,
        comparator: (a, b) => a - b,
        error: 0,
        desc: "Make Score less than 25",
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
        description: `What score value do you think the true line of best fit would have?`,
        options: [
          { id: 1, label: "A really large positive number" },
          { id: 2, label: "A really large negative number" },
          { id: 3, label: "close to 0" },
          { id: 4, label: "A constant value that is not close to 0" },
        ],
      }),
      slope_control,
      intercept_control,
      newPointsEnablerControl,

      new MultiChoiceClass({
        id: 4,
        title: "New Data",
        description:
          "Do you think the $\\textbf{red line}$ that you fit reasonably predicts this new data?",
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
      {id: 0, text: `Our team realized that we missed data for 10 companies, which we've now added to the plot and highlighted in pink.
<br><br>
You'll notice that these $\\textbf{pink companies}$ have unusually high stock prices compared to their revenue.
<br><br>
We've updated our score to include these additional companies in our analysis.
      
      \\[
            \\text{New Score} = \\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2
    \\]
    Note that we have changed the sum from $\\sum_{i=1}^{30}$ to $\\sum_{i=1}^{40}$ to account for the 10 pink companies.
    <br> <br>
$\\textbf{Note}$ : The value of the $\\textbf{New Score}$ is irrelevant; our goal is to get it as close to 0 as possible.
<br><br>
The $\\textbf{green line}$ is the line of best fit that you identified in the last part.

    
        `},
      {id: 1, text: `For simplicity we have fixed the slope of the red line. $\\textbf{Adust the intercept}$ of the $\\textbf{red line}$ to achieve the optimal score. The optimal score is $\\textbf{under 155}$.`},
      {id: 2, text: "We will use the same $\\textbf{5 new companies}$ to validate the red line again."},
    ],
    validations: [
      new Validation_score<number, obj>({
        target_score: 155,
        relation: "<=",
        score_id: 0,
        comparator: (a, b) => a - b,
        error: 0,
        desc: "Make Score less than 155",
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
          "In hindsight, do you think our $\\textbf{red line}$ predicts this new data?",
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
      {id: 0, text:`The pink companies are known as $\\textbf{outliers}$, and they skew our model as seen in the previous part. $\\textbf{Ridge Regression}$ is a modification to our scoring method to better handle these outliers.
        \\[
            \\text{Ridge Score} = \\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2  + \\lambda \\cdot \\text{slope}^2
        \\]

        The only modification is the addition of the $\\lambda \\cdot \\text{slope}^2$ term.  For now, we'll set $\\lambda = 16$, and we'll discuss the choice of $\\lambda$ later. <br> <br>
        The $\\textbf{green line}$ represents the line of best fit obtained in the previous part. Notice how it $\\textbf{does not represent}$ the white data well as it has been skewed by the outliers. <br> <br>
       `},
      {id: 1, text:`We’ve fixed the y-intercept of the red line. Adjust the slope of the $\\textbf{red line}$ to achieve the optimal $\\textbf{Ridge Score}$ which is under 286. <br> <br>
       $\\textbf{Note}$: The value of the $\\textbf{Ridge Score}$ is irrelevant; our focus is on getting it as close to 0 as possible.`},
      {id: 2, text:"Notice how our $\\textbf{red line}$ outperforms the green line on this new data. This modification to the score made our red model more $\\textbf{robust against outliers}$."},
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
        desc: "Make Score less than 286",
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
      { type: "control", id: lambda_slider.id },
      { type: "control", id: slope_control.id },
      { type: "score", id: ridge_score.score_id },
      {type: "control", id: 8},
      { type: "control", id: 4 },
      { type: "question", id: 1 },
    ],
    questions: [
      {id: 0, text:`This modification to the score is called $\\textbf{Ridge Regression}$ and it works well to correct the line in this case. <br> <br> However, a natural question to ask is: how do we choose $\\lambda $ in the $\\textbf{ridge score}$? In the previous part we set $\\lambda = 16$ but is this value always beneficial? <br> <br>

      To explore this, we will consider $\\textbf{how varying $\\lambda$  affects the line}$ for which the ridge score is minimized:
         \\[
            \\text{Ridge Score} = \\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2  + \\lambda \\cdot \\text{slope}^2
        \\] 
      
     Test your hypothesis by $\\textbf{adjusting the sliders}$. After experimenting, proceed to answer the question below`},
      {id: 1, text:`$\\textbf{Hint} $: First, examine the score equation and attempt to infer the purpose of the two terms. To test your hypothesis, set 
$\\lambda$ to a very large value, and adjust the line to minimize the score. Afterward, repeat the process with $\\lambda$ set to a very small value. <br> <br>
      Notice that this is like a game of tug-of-war: the $\\textbf{outliers}$ are pulling the $\\textbf{slope}$ of the line $\\textbf{higher}$ to keep the first term of the score small, while the 
$\\lambda \\cdot \\text{slope}^2 $ term is pulling the $\\textbf{slope lower}$ to reduce the second term. These two forces are working in $\\textbf{opposition}$. The ideal value for  $\\lambda $ depends on the specific problem, and finding the optimal value involves a process of trial and error`},
    ],
    validations: [
      
      new ValidationMultiChoice({
        control_id: 8,
        answer: [3],
        desc: "MCQ 1",
      }),
      new ValidationMultiChoice({
        control_id: 4,
        answer: [1, 2],
        desc: "MCQ 2",
      })
      
      
    ],
    influencesData: [...influences, ...tech_influences],
    controlData: [
      lambda_slider,
      new SliderControl<LineObj>({
        desc: "Slope",
        text: "move this slider to adjust the $\\textbf{slope}$ of the line",
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
        description: "Choose $\\textbf{all}$ the options that are true",
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


      new MultiChoiceClass({
        id: 8,
        title: "Minimising the score",
        description: "Set the value of $\\lambda$ to $\\textbf{$0.5$}$. Choose the option that is $\\textbf{most precise}$",
        options: [
          {
            id: 1,
            label:
              "A score of 0 can be achieved by adjusting the slope",
          },
          {
            id: 2,
            label:
              "A score of under 121 can be achieved by adjusting the slope",
          },
          {
            id: 3,
            label:
              "A score of under 161 can be achieved by adjusting the slope",
          },
          {
            id: 4,
            label: "A score of under 212 can be achieved by adjusting the slope",
          },
        ],
        isMultiSelect: false,
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
      {id: 0, text:`Even if we succeed in selecting an optimal $ \\lambda $, this method is not foolproof. We will construct a scenario where $\\textbf{ridge regression}$ fails. <br>

To recap, the goal of ridge regression is to adjust the slope and intercept of a line in order to make the following $\\textbf{ridge score}$ as close to 0:
\\[
\\text{Ridge Score} = \\sum_{i=1}^{40} \\text{dist}(\\text{line}, (x_i, y_i))^2 + \\lambda \\cdot \\text{slope}^2
\\]
For reference, the $\\textbf{green line}$ represents the true relation between the stock prices and revenue of a company. <br> <br>`},
      {id: 1, text:`Notice that we have $\\textbf{added 4 pink outlier}$ data points. Answer the below questions by selecting the relevant pink points.`},
      {id: 2, text:`As a reminder the $\\textbf{ridge score}$ is designed to $\\textbf{prefer}$ lines with $\\textbf{smaller slopes}$, but is this always beneficial to control outliers?`},
      {id: 3, text:`Choose a position to $\\textbf{place an outlier}$ that would cause ridge regression to shift the slope of the line in the $\\textbf{wrong direction}$. A wrong direction is that which moves the line away from the true line`},
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
        text: "$\\textbf{Select}$ the $\\textbf{2 outlier}$ that if added will $\\textbf{increase}$ the slope of our $\\textbf{green line}$ of best fit",
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
        text: "$\\textbf{Select}$ the $\\textbf{2 outlier}$ that if added will $\\textbf{decrease}$ the slope of our $\\textbf{green line}$ of best fit",
        desc: "Click to Select",
        capacity: 2,
      }),

      new MultiChoiceClass({
        id: 2,
        title: "Prefer Small Slopes",
        description:
          "Do you think prefering small slopes is always a good idea to control outliers?",
        options: [
          {
            id: 1,
            label:
              "No - choosing small slopes does not work if the outliers lie below the true line",
          },
          {
            id: 3,
            label:
              "No - choosing small slopes does not work if the outliers lie above the true line",
          },
          {
            id: 2,
            label: "Yes - choosing small slopes is always beneficial",
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
