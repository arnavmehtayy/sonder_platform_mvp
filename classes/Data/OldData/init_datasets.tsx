// // @/classes/init_data.ts

// import { Control } from "./Control";
// import { obj } from "./obj";
// import { Influence } from "./influence";
// import { Vector2, Vector3 } from "three";
// import * as att_funcs from "./attribute_funcs";
// import { SliderControl } from "./SliderControl";
// import { TouchControl } from "./TouchControl";
// import * as THREE from "three";
// import { LineObj } from "./Lineobj";
// import { geomobj } from "./geomobj";
// import { SelectControl } from "./SelectControl";
// import { SlideContTrans } from "./SliderContTrans";
// import { TransformObj } from "./transformObj";
// import { Score } from "./Score";
// import Placement from "./Placement";
// import TextGeom from "./textgeom";
// import CoordinateAxis from "./CoordinateAxis";
// import Validation from "./Validation";
// import Validation_obj from "./Validation_obj";
// import Validation_test from "./Validation_test";
// import Validation_select from "./Validation_select";
// import Validation_score from "./Validation_score";
// import { MultiChoiceClass } from "./MultiChoiceClass";
// import { ValidationMultiChoice } from "./ValidationMultiChoice";
// import { InputNumber } from "./InputNumber";
// import { Validation_inputNumber } from "./Validation_inputNumber";
// import { init } from "next/dist/compiled/webpack/webpack";
// import FunctionPlot from "./FunctionPlot";
// import { OrderItem } from "@/app/Components/OrderHandler";
// import { EnablerControl } from "./EnablerControl";

// export type data_type = {
//   title: string;
//   questions: string[];
//   influencesData: Influence<any, any, any>[];
//   controlData: Control[];
//   canvasData: obj[];
//   scoreData: Score<any, any>[];
//   placement: Placement | null;
//   validations: Validation[];
//   order: OrderItem[];
// };

// export type experience_type = {
//   name: string;
//   slides: string[];
//   description: string;
// };

// export const experiences: experience_type[] = [
//   {
//     name: "Experience 1",
//     slides: ["default", "set1"],
//     description: "This is a test description",
//   },
//   {
//     name: "Experience 2",
//     slides: ["set1", "default"],
//     description: "This is a test description",
//   },
//   {
//     name: "Experience 3",
//     slides: ["set1", "set1", "default"],
//     description: "This is a test description",
//   },
//   // Add more experiences as needed
// ];

// export const initDataSets: { default: data_type, [key: string]: data_type } = {
//   default: {
//     title: "Question Default",
//     order: [ { type: 'question', id: 0 },
//         { type: 'control', id: 1 },
//         { type: 'control', id: 2 },
//         { type: 'control', id: 4 },
//         { type: 'control', id: 5 },
//         { type: 'control', id: 6 },
//         { type: 'placement', id: 0 },
//         ],
//     questions: ["This is default", "This is default"],
//     validations:
//       // new Validation_obj<THREE.Vector2>(
//       //     {
//       //       obj_id: 1,
//       //       answer: new THREE.Vector2(0,0),
//       //       get_attribute: att_funcs.get_position,
//       //         error: 0.1,

//       //     }
//       //   ),
//       // new Validation_select(
//       //     {
//       //         answer: [2],
//       //         control_id: 4
//       //     }
//       // )
//       [
//         new Validation_test(),
//         new ValidationMultiChoice({
//           answer: [1, 3],
//           control_id: 5,
//         }),
//         new Validation_inputNumber({
//           control_id: 6,
//           answer: 10,
//           error: 1,
//         }),
//       ],
//     influencesData: [
//       new Influence<[Vector3, Vector2], TransformObj, TransformObj>({
//         influence_id: 1,
//         master_id: 2,
//         worker_id: 1,
//         transformation: (value, worker, master) => value,
//         get_attribute: (obj) => [
//           att_funcs.get_rotation(obj),
//           att_funcs.get_position(obj),
//         ],
//         set_attribute: (obj, value) => {
//           return att_funcs.set_position(
//             obj,
//             new Vector2(
//               10 * Math.cos(value[0].z) + value[1].x,
//               10 * Math.sin(value[0].z) + value[1].y
//             )
//           );
//         },
//       }),
//     ],
//     controlData: [
//       new SlideContTrans<geomobj>({
//         id: 1,
//         obj_id: 2,
//         action: "rotate",
//         range: [0, 7],
//         step_size: 0.01,
//       }),
//       new SlideContTrans<geomobj>({
//         id: 2,
//         obj_id: 1,
//         action: "move",
//         range: [-2, 2],
//         step_size: 0.25,
//       }),
//       new SelectControl({
//         id: 4,
//         selectable: [1, 2, 89],
//         isActive: false,
//       }),
//       new MultiChoiceClass({
//         id: 5,
//         isMultiSelect: true,
//         isClickable: true,
//         title: "this is a test",
//         description: "this is a test",
//         options: [
//           { id: 1, label: "arnav" },
//           { id: 2, label: "Rachana" },
//           { id: 3, label: "Anaya" },
//           { id: 4, label: "Amar" },
//         ],
//       }),
//       new InputNumber({
//         control_id: 6,
//         value: 0,
//         desc: "input a number",
//         text: "here you need to input a number",
//         placeholder: "number",
//         initial_value: 0,
//         min: 0,
//         max: 100,
//         step: 1,
//       }),
//     ],
//     canvasData: [
//       new TextGeom({
//         geom: new THREE.PlaneGeometry(4, 4),
//         id: 89,
//         text: "Arnav",
//         position: new Vector2(-4, -4),
//         color: "blue",
//         touch_controls: new TouchControl({
//           translate: {
//             direction: [true, true, false],
//             range: [-10, 10],
//             step_size: 1,
//           },
//         }),
//       }),

//       new geomobj({
//         id: 1,
//         geom: new THREE.PlaneGeometry(4, 4),
//         position: new THREE.Vector2(8, 0),
//         color: "green",
//         isClickable: true,
//         touch_controls: new TouchControl({
//           translate: {
//             direction: [true, true, false],
//             range: [-10, 10],
//             step_size: 1,
//           },
//         }),
//       }),
//       new geomobj({
//         id: 2,
//         isClickable: true,
//         geom: new THREE.PlaneGeometry(4, 4),
//         position: new THREE.Vector2(0, 0),
//         color: "red",
//         touch_controls: new TouchControl({
//           translate: {
//             direction: [true, true, false],
//             range: [1, 10],
//             step_size: 1,
//           },
//         }),
//       }),
//     ],
//     scoreData: [],
//     placement: new Placement({
//       grid: [20, 20],
//       cellSize: 5,
//       object_ids: [999],
//       geometry: new THREE.PlaneGeometry(1, 1),
//     }),
//   },
//   set1: {
//     title: "Introduction to Linear Regression",
//     order: [ { type: 'question', id: 0 },
//       { type: 'score', id: 1 },
//         { type: 'control', id: 1 },
//         { type: 'control', id: 2 },
//         { type: 'control', id: 4 },
//         { type: 'control', id: 5 },
//         { type: 'placement', id: 0 },
        
//         {type: 'control', id: 6}
//         ],
//     questions: [`
//         We are studying the relationship between a company's average stock price and its revenue over a year using data from 30 companies. 

//         <br> <br> 
//         We observe a linear relationship and fit a line to this data. We evaluate how well the line fits by calculating the score:

//         \\[
//             \\text{Score} = \\sum_{i=1}^{30} \\text{dist}(\\text{line}, (x_i, y_i))^2
//         \\]

//         where \\( \\text{dist}(\\text{line}, (x_i, y_i)) \\) is the shortest distance from the line to each point \\( (x_i, y_i) \\). In the diagram, the grey lines represent these distances.
//         <br> <br>

//         In simpler terms, we look at the 30 points on the graph, measure the distance from each point to the line, square these distances, and then add them all up.`, 
//       `What do you think our goal is with the score`, 
//       `Try adjusting the slope and intercept of the line to achieve the optimal score.`,
//       `We received information on 5 new companies yesterday. Click below to reveal it. In hindsight, do you think the line we fit above performs well to predict this new data?`
//       ],
//     validations: [
//       new Validation_score<number, obj>({
//         target_score: 30,
//         relation: "<=",
//         score_id: 1,
//         comparator: (a, b) => a - b,
//         error: 1,
//       }),

//       new Validation_select({
//         answer: [1000],
//         control_id: 4,
//       }),
//     ],
//     influencesData: [],
//     controlData: [
//       new SliderControl<LineObj>({
//         id: 1,
//         obj_id: 1000,
//         range: [-10, 10],
//         step_size: 0.01,
//         set_attribute: att_funcs.set_slope,
//         get_attribute: att_funcs.get_slope,
//       }),
//       new SliderControl<LineObj>({
//         id: 2,
//         obj_id: 1000,
//         range: [0, 10],
//         step_size: 0.01,
//         set_attribute: att_funcs.set_intercept,
//         get_attribute: att_funcs.get_intercept,
//       }),
//       new SelectControl({
//         id: 4,
//         selectable: [26, 27, 28, 29, 1000],
//         isActive: false,
//         capacity: 4,
//       }),
//       new SelectControl({
//         id: 5,
//         selectable: [26, 27], // [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],
//         isActive: false,
//         capacity: 1,
//       }),

//       new EnablerControl({
//         control_id: 6,
//         isClickable: true,
//         desc: "This is a test",
//         text: "This is a test",
//         obj_ids: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
//           47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61,]
//       }),
      
//     ],
//     canvasData: [new CoordinateAxis({ id: 99999 })],
//     scoreData: [
//       new Score<number, LineObj>({
//         text: "Line Score",
//         score_id: 1,
//         obj_id_list: [
//           30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
//           47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61,
//         ],
//         get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
//         to_string: (val) => (Math.round(val * 10) / 10).toString(),
//         transformation: (vals) => {
//           let sum: number = 0;
//           for (let i = 0; i < vals.length; i++) {
//             sum += vals[i];
//           }
//           return sum;
//         },
//       }),
//     ],
//     placement: new Placement({
//       grid: [30, 30],
//       cellSize: 5,
//       object_ids: [60, 5555],
//       geometry: new THREE.CircleGeometry(0.3, 128),
//       gridVectors: [
//         new Vector2(2, 2),
//         new Vector2(3, 3),
//         new Vector2(1, 0),
//         new Vector2(2, 0),
//       ],
//       text: "This is testing placement",
//       color: "white",
//     }),
//   },
//   set2: {
//     title: "Question set2",
//     order: [{ type: "question", id: 0 }],
//     questions: ["This is set2", "This"],
//     validations: [new Validation_test()],
//     influencesData: [],
//     controlData: [],
//     canvasData: [],
//     scoreData: [],
//     placement: null,
//   },
// };

// // Create the line object
// let line = new LineObj({
//   id: 1000,
//   start: new Vector2(0, 0),
//   end: new Vector2(0, 0),
//   line_width: 5,
//   color: "red",
// });
// line = LineObj.set_slope_intercept(line, 0, 0.5, [-30, 30]);

// // Add the line to canvasData
// initDataSets.set1.canvasData.push(line);

// const num_points = 30;
// let points: Vector2[] = [];

// for (let i = 0; i < num_points; i++) {
//   const point = new Vector2(i / 2, 2 + i / 10 + 3 * Math.random());
//   points.push(point);
// }

// for (let i = 0; i < num_points; i++) {
//   initDataSets.set1.canvasData.push(
//     new geomobj({
//       id: i,
//       geom: new THREE.CircleGeometry(0.23, 128),
//       position: points[i],
//       color: "white",
      
//     })
    
//   );

//   initDataSets.set1.canvasData.push(
//     new LineObj({
//       id: i + num_points,
//       start: points[i],
//       end: new Vector2(0, 0),
//       line_width: 3,
//       color: "gray",
//       isEnabled: false
//     })
//   );

//   initDataSets.set1.influencesData.push(
//     new Influence<any, LineObj, LineObj>({
//       influence_id: i,
//       master_id: 1000,
//       worker_id: i + num_points,
//       transformation: (value, worker, master) => {
//         const slope = value.y;
//         const intercept = value.x;
//         const x = worker.start.x;
//         const y = worker.start.y;
//         let perp_slope = 0;
//         if (slope != 0) {
//           perp_slope = -1 / slope;
//         }
//         const b = y - perp_slope * x;
//         let new_x = worker.start.x;
//         if (slope != 0) {
//           new_x = (b - intercept) / (slope - perp_slope);
//         }
//         const new_y = slope * new_x + intercept;
//         return new Vector2(new_x, new_y);
//       },
//       get_attribute: att_funcs.get_slope_intercept,
//       set_attribute: att_funcs.set_end_point,
//     })
//   );
// }
// initDataSets.set1.canvasData.push(
//   new LineObj({
//     id: 61,
//     start: new Vector2(0, 0),
//     end: new Vector2(1, 1),
//     line_width: 2,
//     color: "gray",
//   })
// );

// initDataSets.set1.canvasData.push(
//   new FunctionPlot({
//     id: 999999,
//     position: new Vector2(0, 0),
//     color: "purple",
//     func: (x: number) => x ** 2,
//     xRange: [-10, 10],
//     numPoints: 500,
//     lineWidth: 4,
//   })
// );

// initDataSets.set1.influencesData.push(
//   new Influence<any, LineObj, LineObj>({
//     influence_id: 60,
//     master_id: 1000,
//     worker_id: 61,
//     transformation: (value, worker, master) => {
//       const slope = value.y;
//       const intercept = value.x;
//       const x = worker.start.x;
//       const y = worker.start.y;
//       let perp_slope = 0;
//       if (slope != 0) {
//         perp_slope = -1 / slope;
//       }
//       const b = y - perp_slope * x;
//       let new_x = worker.start.x;
//       if (slope != 0) {
//         new_x = (b - intercept) / (slope - perp_slope);
//       }
//       const new_y = slope * new_x + intercept;
//       return new Vector2(new_x, new_y);
//     },
//     get_attribute: att_funcs.get_slope_intercept,
//     set_attribute: att_funcs.set_end_point,
//   })
// );

// initDataSets.set1.influencesData.push(
//   new Influence<Vector2, geomobj, LineObj>({
//     influence_id: 60,
//     master_id: 60,
//     worker_id: 61,
//     transformation: (value, worker, master) => {
//       return value;
//     },
//     get_attribute: (obj: geomobj) => att_funcs.get_position(obj),
//     set_attribute: (obj: LineObj, value) =>
//       att_funcs.set_start_point(obj, value),
//   })
// );
