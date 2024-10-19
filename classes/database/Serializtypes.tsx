import { 
  AxisObjectInsert, 
  DummyDataStorageInsert, 
  FunctionPlotStringInsert, 
  GeomObjInsert, 
  LineObjInsert, 
  TextGeomInsert,
  AxisObjectSelect,
  DummyDataStorageSelect,
  FunctionPlotStringSelect,
  GeomObjSelect,
  LineObjSelect,
  TextGeomSelect
} from "@/app/db/schema"

export interface SerializeStateInsert {
    title: string
    camera_zoom: number
    GeomObjs: GeomObjInsert
    LineObjs: LineObjInsert[]
    FunctionPlotStrings: FunctionPlotStringInsert[]
    DummyDataStorages: DummyDataStorageInsert[]
    AxisObjects: AxisObjectInsert[]
    TextGeoms: TextGeomInsert[]

    // more things depending on the state
}

export interface SerializeStateSelect {
    title: string
    camera_zoom: number
    GeomObjs: GeomObjSelect
    LineObjs: LineObjSelect[]
    FunctionPlotStrings: FunctionPlotStringSelect[]
    DummyDataStorages: DummyDataStorageSelect[]
    AxisObjects: AxisObjectSelect[]
    TextGeoms: TextGeomSelect[]

    // more things depending on the state
}