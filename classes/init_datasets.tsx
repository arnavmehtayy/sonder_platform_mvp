// @/classes/init_data.ts

import { Control } from "./Control";
import { obj } from "./obj";
import { Influence } from "./influence";
import { Vector2, Vector3 } from "three";
import * as att_funcs from "./attribute_funcs";
import { SliderControl } from "./SliderControl";
import { TouchControl } from "./TouchControl";
import * as THREE from "three";
import { LineObj } from "./Lineobj";
import { geomobj } from "./geomobj";
import { SelectControl } from "./SelectControl";
import { SlideContTrans } from "./SliderContTrans";
import { TransformObj } from "./transformObj";
import { Score } from "./Score";
import Placement from "./Placement";
import TextGeom from "./textgeom";

type data_type = {
    question : string;
    influencesData: Influence<any, any, any>[];
    controlData: Control[];
    canvasData: obj[];
    scoreData: Score<any, any>[];
    placement: Placement | null;
};

export const initDataSets: { [key: string]: data_type } = {
    default: {
        question: "This is default",
        influencesData: [
            new Influence<[Vector3, Vector2], TransformObj, TransformObj>({
                influence_id: 1,
                master_id: 2,
                worker_id: 1,
                transformation: (value, worker, master) => value,
                get_attribute: (obj) => [att_funcs.get_rotation(obj), att_funcs.get_position(obj)],
                set_attribute: (obj, value) => {
                    return att_funcs.set_position(
                        obj,
                        new Vector2(10 * Math.cos(value[0].z) + value[1].x, 10 * Math.sin(value[0].z) + value[1].y)
                    );
                },
            }),
        ],
        controlData: [
            new SlideContTrans<geomobj>({
                id: 1,
                obj_id: 2,
                action: "rotate",
                range: [0, 7],
                step_size: 0.01,
            }),
            new SlideContTrans<geomobj>({
                id: 2,
                obj_id: 1,
                action: "move",
                range: [-2, 2],
                step_size: 0.25,
            }),
            new SelectControl({
                id: 4,
                selectable: [1, 2, 89],
                isActive: false
            })
        ],
        canvasData: [
            new TextGeom({
                geom: new THREE.PlaneGeometry(4, 4),
                id: 89,
                text: "Arnav",
                position: new Vector2(-4, -4),
                color: "blue",
                touch_controls: new TouchControl({
                    translate: {
                        direction: [true, true, false],
                        range: [-10, 10],
                        step_size: 1,
                    },
                }),
            }),

            new geomobj({
                id: 1,
                geom: new THREE.PlaneGeometry(4, 4),
                position: new THREE.Vector2(8, 0),
                color: "green",
                isClickable: true,
                touch_controls: new TouchControl({
                    translate: {
                        direction: [true, true, false],
                        range: [-10, 10],
                        step_size: 1,
                    },
                }),
            }),
            new geomobj({
                id: 2,
                isClickable: true,
                geom: new THREE.PlaneGeometry(4, 4),
                position: new THREE.Vector2(0, 0),
                color: "red",
                touch_controls: new TouchControl({
                    translate: {
                        direction: [true, true, false],
                        range: [1, 10],
                        step_size: 1,
                    },
                }),
            }),
        ],
        scoreData: [],
        placement: new Placement({
            grid: [20, 20],
            cellSize: 5,
            object_id: 999,
            geometry: new THREE.PlaneGeometry(1, 1),
        }),
    },
    set1: {
        question: "This is set1",
        influencesData: [],
        controlData: [
            new SliderControl<LineObj>({
                id: 1,
                obj_id: 1000,
                range: [-10, 10],
                step_size: 0.01,
                set_attribute: att_funcs.set_slope,
                get_attribute: att_funcs.get_slope,
            }),
            new SliderControl<LineObj>({
                id: 2,
                obj_id: 1000,
                range: [0, 10],
                step_size: 0.01,
                set_attribute: att_funcs.set_intercept,
                get_attribute: att_funcs.get_intercept,
            }),
            new SelectControl({
                id: 4,
                selectable: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29, 1000],
                isActive: false,
                capacity: 4,
            }),
            new SelectControl({
                id: 5,
                selectable:[50,51,52,54,56], // [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],
                isActive: false,
                capacity: 1,
            }),
            
        ],
        canvasData: [],
        scoreData: [
            new Score<number, LineObj>({
                text: "Mean Squared Error",
                score_id: 1,
                obj_id_list: [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,61],
                get_attribute: (obj: LineObj) => att_funcs.get_length(obj),
                to_string: (val) => (Math.round(val * 10) / 10).toString(),
                transformation: (vals) => {
                    let sum: number = 0;
                    for(let i = 0; i < vals.length; i++) {
                        sum += vals[i];
                    }
                    return sum;
                }
            })
        ],
        placement: new Placement({
            grid: [30,30],
            cellSize: 5,
            object_id: 60,
            geometry: new THREE.CircleGeometry(0.3, 128),
            gridVectors: [new Vector3(2,2), new Vector3(3,3), new Vector3(1,0), new Vector3(2,0)],
        }),
    },
    set2: {
        question: "",
        influencesData: [],
        controlData: [],
        canvasData: [],
        scoreData: [],
        placement: null,
    },
};

// Create the line object
let line = new LineObj({
    id: 1000,
    start: new Vector2(0, 0),
    end: new Vector2(0, 0),
    line_width: 5,
    color: "white",
});
line = LineObj.set_slope_intercept(line, 0, 0.5, [-30, 30]);

// Add the line to canvasData
initDataSets.set1.canvasData.push(line);

const num_points = 30;
let points: Vector2[] = [];

for (let i = 0; i < num_points; i++) {
    const point = new Vector2(i / 2, 2 + i / 10 + 3 * Math.random());
    points.push(point);
}

for (let i = 0; i < num_points; i++) {
    initDataSets.set1.canvasData.push(
        new geomobj({
            id: i,
            geom: new THREE.CircleGeometry(0.3, 128),
            position: points[i],
            color: "blue",
        })
    );

    initDataSets.set1.canvasData.push(
        new LineObj({
            id: i + num_points,
            start: points[i],
            end: new Vector2(0, 0),
            line_width: 2,
            color: "red",
        })
    );



        initDataSets.set1.influencesData.push(
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
                if(slope != 0) {
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
initDataSets.set1.canvasData.push(
    new LineObj({
        id: 61,
        start: new Vector2(0,0),
        end: new Vector2(1, 1),
        line_width: 2,
        color: "red",
    })
);

initDataSets.set1.influencesData.push(
    new Influence<any, LineObj, LineObj>({
        influence_id: 60,
        master_id: 1000,
        worker_id: 61,
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
        if(slope != 0) {
            new_x = (b - intercept) / (slope - perp_slope);
        }
        const new_y = slope * new_x + intercept;
        return new Vector2(new_x, new_y);
    },
    get_attribute: att_funcs.get_slope_intercept,
    set_attribute: att_funcs.set_end_point,
}))

initDataSets.set1.influencesData.push(
    new Influence<Vector2, geomobj, LineObj>({
        influence_id: 60,
        master_id: 60,
        worker_id: 61,
        transformation: (value, worker, master) => {
 return value;
    },
    get_attribute: (obj: geomobj) => att_funcs.get_position(obj),
    set_attribute: (obj: LineObj, value) => att_funcs.set_start_point(obj, value),
}))

