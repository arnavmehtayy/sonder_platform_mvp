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
    GeomObjs: Omit<GeomObjInsert, 'stateId'>[]
    LineObjs: Omit<LineObjInsert, 'stateId'>[]
    FunctionPlotStrings: Omit<FunctionPlotStringInsert, 'stateId'>[]
    DummyDataStorages: Omit<DummyDataStorageInsert, 'stateId'>[]
    AxisObjects: Omit<AxisObjectInsert, 'stateId'>[]
    TextGeoms: Omit<TextGeomInsert, 'stateId'>[]

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