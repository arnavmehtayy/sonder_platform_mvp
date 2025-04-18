// note there is no inheritance in these dictionaries this is a flaw I right now manually update it
import { TransformObj } from "./transformObj";
import TextGeom from "./textgeomObj";
import { LineObj } from "./Lineobj";
import { Vector2 } from "three";
import FunctionPlot from "./FunctionPlot";
import CoordinateAxis from "./CoordinateAxis";
import FunctionPlotString from "./FunctionPlotString";
import { DummyDataStorage, DummyDataSupportedTypes } from "./DummyDataStore";
import coloredObj from "./coloredObj";
import { obj, object_types } from "./obj";

export type att_type = number | string | boolean;
export interface get_attributes<T extends obj, V extends att_type = att_type> {
  get_attribute: (obj: T) => V;
  set_attribute: (obj: T, value: V) => T;
}

export type dict_keys = "number" | "string" | "boolean";
export interface dict_get_attributes<T extends obj> {
  number: { [key: string]: get_attributes<T, number> };
  string: { [key: string]: get_attributes<T, string> };
  boolean: { [key: string]: get_attributes<T, boolean> };
}

export const obj_atts: dict_get_attributes<obj> = {
  number: {},
  string: {
    name: {
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
  },
  boolean: {},
};
export const color_atts: dict_get_attributes<coloredObj> = {
  number: {},
  string: {
    color: {
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

    name: {
      get_attribute: (obj: coloredObj) => obj.name,
      set_attribute: (obj: coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.name = value;
        return newObj;
      },
    },
  },
  boolean: {},
}
export const transform_atts: dict_get_attributes<TransformObj> = {
  number: {
    "position-x": {
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
    "position-y": {
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
    "rotation-z": {
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
    "scale-x": {
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
    "scale-y": {
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
  },
  string: {
    color: {
      get_attribute: (obj: TransformObj & coloredObj) => obj.color,
      set_attribute: (obj: TransformObj & coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.color = value;
        return newObj;
      },
    },
    name: {
      get_attribute: (obj: TransformObj & coloredObj) => obj.name,
      set_attribute: (obj: TransformObj & coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.name = value;
        return newObj;
      },
    },
  },
  boolean: {},
};
export const text_atts: dict_get_attributes<TextGeom> = {
  number: {
    "position-x": {
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
    "position-y": {
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
    "rotation-z": {
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
    "scale-x": {
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
    "scale-y": {
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
  },
  string: {
    text: {
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
  },
  boolean: {},
};
export const line_atts: dict_get_attributes<LineObj> = {
  number: {
    line_width: {
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
    "start-x": {
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
    "start-y": {
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
    "end-x": {
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
    "end-y": {
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
    slope: {
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
    intercept: {
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
    "point1-x": {
      get_attribute: (obj: LineObj) => obj.point1?.x || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, "point1-x");
        return newObj;
      },
    },
    "point1-y": {
      get_attribute: (obj: LineObj) => obj.point1?.y || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, "point1-y");
        return newObj;
      },
    },
    "point2-x": {
      get_attribute: (obj: LineObj) => obj.point2?.x || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, "point2-x");
        return newObj;
      },
    },
    "point2-y": {
      get_attribute: (obj: LineObj) => obj.point2?.y || 0,
      set_attribute: (obj: LineObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.set_points(value, "point2-y");
        return newObj;
      },
    },
  },
  string: {
    color: {
      get_attribute: (obj: LineObj) => obj.color,
      set_attribute: (obj: LineObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.color = value;
        return newObj;
      },
    },
    name: {
      get_attribute: (obj: LineObj) => obj.name,
      set_attribute: (obj: LineObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.name = value;
        return newObj;
      },
    },
  },
  boolean: {},
};
export const functionplot_atts: dict_get_attributes<FunctionPlot> = {
  number: {
    "xRange-a": {
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
    "xRange-b": {
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
    numPoints: {
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
    lineWidth: {
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
    "position-x": {
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
    "position-y": {
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
    "rotation-z": {
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
    "scale-x": {
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
    "scale-y": {
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
  },
  string: {
    color: {
      get_attribute: (obj: TransformObj & coloredObj) => obj.color,
      set_attribute: (obj: TransformObj & coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.color = value;
        return newObj;
      },
    },
    name: {
      get_attribute: (obj: TransformObj & coloredObj) => obj.name,
      set_attribute: (obj: TransformObj & coloredObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.name = value;
        return newObj;
      },
    },
  },
  boolean: {},
};

export const FunctionPlotString_atts: dict_get_attributes<FunctionPlotString> =
  {
    number: {
      

      "xRange-a": {
      get_attribute: (obj: FunctionPlotString) => obj.xRange[0],
      set_attribute: (obj: FunctionPlotString, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.xRange = [value, obj.xRange[1]];
        return newObj;
      },
    },
    "xRange-b": {
      get_attribute: (obj: FunctionPlotString) => obj.xRange[1],
      set_attribute: (obj: FunctionPlotString, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.xRange = [obj.xRange[0], value];
        return newObj;
      },

      
    },
    ...transform_atts['number']

    },
    string: {},
    boolean: {},
  };

export const Axis_atts: dict_get_attributes<CoordinateAxis> = {
  number: {
    "axis_scale": {
      get_attribute: (obj: CoordinateAxis) => obj.tickSpacing,
      set_attribute: (obj: CoordinateAxis, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.tickSpacing = value;
        return newObj;
      },
      
    }
    ,
    "position-x": {
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
    "position-y": {
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
    "rotation-x": {
      get_attribute: (obj: TransformObj) => obj.rotation.x,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.rotation.x = value;
        return newObj;
      },
    },
    "rotation-y": {
      get_attribute: (obj: TransformObj) => obj.rotation.y,
      set_attribute: (obj: TransformObj, value: number) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.rotation.y = value;
        return newObj;
      },
    },
    "rotation-z": {
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
    "scale-x": {
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
    "scale-y": {
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
    
    
  },
  string: {
    "x-label": {
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
    "y-label": {
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
    color: {
      get_attribute: (obj: TransformObj) => obj.color,
      set_attribute: (obj: TransformObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.color = value;
        return newObj;
      },
    },
    name: {
      get_attribute: (obj: TransformObj) => obj.name,
      set_attribute: (obj: TransformObj, value: string) => {
        const newObj = Object.assign(
          Object.create(Object.getPrototypeOf(obj)),
          obj
        );
        newObj.name = value;
        return newObj;
      },
    },
  },
  boolean: {
  },
};

export const Dummy_atts: dict_get_attributes<DummyDataStorage<any>> = {
  number: {
    "data-number": {
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
  },
  string: {
    "data-string": {
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
  },
  boolean: {
    "data-boolean": {
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
  },
};




// export const dummy_data_atts: dict_get_attributes<DummyDataStorage<DummyDataSupportedTypes>> = {
//   number: {
//     "variable_num": {
//       get_attribute: (obj: DummyDataStorage<DummyDataSupportedTypes>) => {
//         if (typeof obj.data === "number") {
//           return obj.data;
//         }
//         return 0; // Default value if data is not a number
//       },
//       set_attribute: (obj: DummyDataStorage<DummyDataSupportedTypes>, value: number) => {
//         const newObj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
//         newObj.data = value;
//         return newObj;
//       },
//     },
//   },
//   string: {
//     "variable_str": {
//       get_attribute: (obj: DummyDataStorage<DummyDataSupportedTypes>) => {
//         if (typeof obj.data === "string") {
//           return obj.data;
//         }
//         return ""; // Default value if data is not a string
//       },
//       set_attribute: (obj: DummyDataStorage<DummyDataSupportedTypes>, value: string) => {
//         const newObj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
//         newObj.data = value;
//         return newObj;
//       },
//     },
//   },
//   boolean: {
//     "variable_bool": {
//       get_attribute: (obj: DummyDataStorage<DummyDataSupportedTypes>) => {
//         if (typeof obj.data === "boolean") {
//           return obj.data;
//         }
//         return false; // Default value if data is not a boolean
//       },
//       set_attribute: (obj: DummyDataStorage<DummyDataSupportedTypes>, value: boolean) => {
//         const newObj = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
//         newObj.data = value;
//         return newObj;
//       },
//     },
//   },
// };

export const atts: Partial<{
  [key in object_types]: dict_get_attributes<any>;
}> = {
  Obj: obj_atts,
  ColoredObj: color_atts,
  TransformObj: transform_atts,
  DummyDataStorage: Dummy_atts,
  CoordinateAxis: Axis_atts,
  FunctionPlot: functionplot_atts,
  FunctionPlotString: FunctionPlotString_atts,
  TextGeomObj: text_atts,
  LineObj: line_atts,
  GeomObj: transform_atts,

};
