import coloredObj from "./coloredObj";
import { obj } from "./obj";
import { TransformObj } from "./transformObj";
import TextGeom from "./textgeomObj";
import { LineObj } from "./Lineobj";
import { Vector2 } from "three";
import FunctionPlot from "./FunctionPlot";
import CoordinateAxis from "./CoordinateAxis";
import { DummyDataStorage } from "./DummyDataStore";

export type get_att_type = number | string | boolean;
export interface get_attributes<
  T extends obj,
  V extends get_att_type = get_att_type
> {
  label: string;
  get_attribute: (obj: T) => V;
  set_attribute: (obj: T, value: V) => T;
}

export type dict_keys = "number" | "string" | "boolean";
export interface dict_get_attributes<T extends obj> {
    ["number"]: get_attributes<T, number>[];
    ["string"]: get_attributes<T, string>[];
    ["boolean"]: get_attributes<T, boolean>[];
}

export const obj_atts: dict_get_attributes<obj> = {
  number: [],
  string: [
    {
      label: "name",
      get_attribute: (obj: obj) => obj.name,
      set_attribute: (obj: obj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.name = value;
        return newObj;
      },
    },
  ],
  boolean: [],
};
export const color_atts: dict_get_attributes<coloredObj> = {
  number: [],
  string: [
    {
      label: "color",
      get_attribute: (obj: coloredObj) => obj.color,
      set_attribute: (obj: coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.color = value;
        return newObj;
      },
    },
  ],
  boolean: [],
};
export const transform_atts: dict_get_attributes<TransformObj> = {
  number: [
    {
      label: "position-x",
      get_attribute: (obj: TransformObj) => obj.position.x,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.position.x = value;
        return newObj;
      },
    },
    {
      label: "position-y",
      get_attribute: (obj: TransformObj) => obj.position.y,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.position.y = value;
        return newObj;
      },
    },
    {
      label: "rotation-z",
      get_attribute: (obj: TransformObj) => obj.rotation.z,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.rotation.z = value;
        return newObj;
      },
    },
    {
      label: "scale-x",
      get_attribute: (obj: TransformObj) => obj.scale.x,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.scale.x = value;
        return newObj;
      },
    },
    {
      label: "scale-y",
      get_attribute: (obj: TransformObj) => obj.scale.y,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.scale.y = value;
        return newObj;
      },
    },
  ],
  string: [],
  boolean: [],
};
export const text_atts: dict_get_attributes<TextGeom> = {
  number: [],
  string: [
    {
      label: "text",
      get_attribute: (obj: TextGeom) => obj.text,
      set_attribute: (obj: TextGeom, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.text = value;
        return newObj;
      },
    },
  ],
  boolean: [],
};
export const line_atts: dict_get_attributes<LineObj> = {
  number: [
    {
      label: "line_width",
      get_attribute: (obj: LineObj) => obj.line_width,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.line_width = value;
        return newObj;
      },
    },
    {
      label: "start-x",
      get_attribute: (obj: LineObj) => obj.start.x,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.start.x = value;
        return newObj;
      },
    },
    {
      label: "start-y",
      get_attribute: (obj: LineObj) => obj.start.y,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.start.y = value;
        return newObj;
      },
    },
    {
      label: "end-x",
      get_attribute: (obj: LineObj) => obj.end.x,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.end.x = value;
        return newObj;
      },
    },
    {
      label: "end-y",
      get_attribute: (obj: LineObj) => obj.end.y,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.end.y = value;
        return newObj;
      },
    },
    {
      label: "slope",
      get_attribute: (obj: LineObj) => obj.get_slope_intercept()[1],
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        const [b, m, range] = obj.get_slope_intercept();
        newObj.start = new Vector2(range[0], value * range[0] + b);
        newObj.end = new Vector2(range[1], value * range[1] + b);
        return newObj;
      },
    },
    {
      label: "intercept",
      get_attribute: (obj: LineObj) => obj.get_slope_intercept()[0],
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        const [b, m, range] = obj.get_slope_intercept();
        newObj.start = new Vector2(range[0], m * range[0] + value);
        newObj.end = new Vector2(range[1], m * range[1] + value);
        return newObj;
      },
    },
    {
      label: "point1-x",
      get_attribute: (obj: LineObj) => obj.point1?.x || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, 'point1-x');
        return newObj;
      },
    },
    {
      label: "point1-y",
      get_attribute: (obj: LineObj) => obj.point1?.y || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, 'point1-y');
        return newObj;
      },
    }
    ,
    {
      label: "point2-x",
      get_attribute: (obj: LineObj) => obj.point2?.x || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, 'point2-x');
        return newObj;
      },

    },
    {
      label: "point2-y",
      get_attribute: (obj: LineObj) => obj.point2?.y || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, 'point2-y');
        return newObj;
      },
    }

  ],
  string: [],
  boolean: [],
};
export const functionplot_atts: dict_get_attributes<FunctionPlot> = {
  number: [
    {
      label: "xRange-a",
      get_attribute: (obj: FunctionPlot) => obj.xRange[0],
      set_attribute: (obj: FunctionPlot, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.xRange = [value, obj.xRange[1]];
        return newObj;
      },
    },
    {
      label: "xRange-b",
      get_attribute: (obj: FunctionPlot) => obj.xRange[1],
      set_attribute: (obj: FunctionPlot, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.xRange = [obj.xRange[0], value];
        return newObj;
      },
    },
    {
      label: "numPoints",
      get_attribute: (obj: FunctionPlot) => obj.numPoints,
      set_attribute: (obj: FunctionPlot, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.numPoints = value;
        return newObj;
      },
    },
    {
      label: "lineWidth",
      get_attribute: (obj: FunctionPlot) => obj.lineWidth,
      set_attribute: (obj: FunctionPlot, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.lineWidth = value;
        return newObj;
      },
    },
  ],
  string: [],
  boolean: [],
};

export const Axis_atts: dict_get_attributes<CoordinateAxis> = {
  number: [],
  string: [
    {
      label: "x-label",
      get_attribute: (obj: CoordinateAxis) => obj.xLabel,
      set_attribute: (obj: CoordinateAxis, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.xLabel = value;
        return newObj;
      },
    },
    {
      label: "y-label",
      get_attribute: (obj: CoordinateAxis) => obj.yLabel,
      set_attribute: (obj: CoordinateAxis, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.yLabel = value;
        return newObj;
      },
    },
  ],
  boolean: [],
};

export const Dummy_atts: dict_get_attributes<DummyDataStorage<any>> = {
    number: [
        {
            label: "data-number",
            get_attribute: (obj: DummyDataStorage<number>) => obj.data,
            set_attribute: (obj: DummyDataStorage<number>, value: number) => {
                const newObj = Object.assign(
                    Object.create(Object.getPrototypeOf(obj)),
                    obj
                );
                newObj.data = value;
                return newObj;
            },
        },
    ],
    string: [
        {
            label: "data-string",
            get_attribute: (obj: DummyDataStorage<string>) => obj.data,
            set_attribute: (obj: DummyDataStorage<string>, value: string) => {
                const newObj = Object.assign(
                    Object.create(Object.getPrototypeOf(obj)),
                    obj
                );
                newObj.data = value;
                return newObj;
            },
        },
    ],
    boolean: [
        {
            label: "data-boolean",
            get_attribute: (obj: DummyDataStorage<boolean>) => obj.data,
            set_attribute: (obj: DummyDataStorage<boolean>, value: boolean) => {
                const newObj = Object.assign(
                    Object.create(Object.getPrototypeOf(obj)),
                    obj
                );
                newObj.data = value;
                return newObj;
            },
        },
    ],
}
