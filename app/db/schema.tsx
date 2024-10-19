import { ControlConstructor } from '@/classes/Controls/Control';
import { TouchControlAttributes } from '@/classes/Controls/TouchControl';
import { InfluenceConstructor } from '@/classes/influence';
import { PlacementConstructor } from '@/classes/Placement';
import { ScoreConstructor } from '@/classes/Scores/Score';
import { ValidationConstructor } from '@/classes/Validation/Validation';
import { geom_param_type, geom_type, PredefinedGeometry } from '@/classes/vizobjects/geomobj';
import { objconstructor } from '@/classes/vizobjects/obj';
import { integer, boolean, real, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';


export const states = pgTable('users_table', {
  id: serial('id').primaryKey(),
  state_name: text('state_name').notNull().unique(),
  camera_zoom: real("camera_zoom").default(20.0),
  title: text("title").notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const GeomObj = pgTable('geom_obj', {
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  objId: integer('obj_id').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  position_x: real('position_x').notNull(),
  position_y: real('position_y').notNull(),
  rotation_x: real('rotation_x').notNull(),
  rotation_y: real('rotation_y').notNull(),
  rotation_z: real('rotation_z').notNull(),
  scale_x: real('scale_x').notNull(),
  scale_y: real('scale_y').notNull(),
  scale_z: real('scale_z').notNull(),
  touch_controls: jsonb('touch_controls').$type<{
    translate?: TouchControlAttributes;
    rotate?: TouchControlAttributes;
    scale?: TouchControlAttributes;
  }>(),
  geometry_type: text('geometry_type').$type<geom_type>().notNull(),
  geometry_atts: jsonb('geometry_atts').$type<geom_param_type>().notNull()
  // geom_atts_json: jsonb('geom_json').$type<PredefinedGeometry>().notNull(),
});

// Existing imports...
import { LineConstTypes } from '@/classes/vizobjects/Lineobj';

// ... (existing code)

export const TextGeom = pgTable('text_geom', {
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  objId: integer('obj_id').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  position_x: real('position_x').notNull(),
  position_y: real('position_y').notNull(),
  rotation_x: real('rotation_x').notNull(),
  rotation_y: real('rotation_y').notNull(),
  rotation_z: real('rotation_z').notNull(),
  scale_x: real('scale_x').notNull(),
  scale_y: real('scale_y').notNull(),
  scale_z: real('scale_z').notNull(),
  touch_controls: jsonb('touch_controls').$type<{
    translate?: TouchControlAttributes;
    rotate?: TouchControlAttributes;
    scale?: TouchControlAttributes;
  }>(),
  geometry_type: text('geometry_type').$type<geom_type>().notNull(),
  geometry_atts: jsonb('geometry_atts').$type<geom_param_type>().notNull(),
  text: text('text').notNull(),
});

export const LineObj = pgTable('line_obj', {
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  objId: integer('obj_id').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  constructionType: text('construction_type').$type<LineConstTypes>().notNull(),
  start_x: real('start_x').notNull(),
  start_y: real('start_y').notNull(),
  end_x: real('end_x').notNull(),
  end_y: real('end_y').notNull(),
  slope: real('slope'),
  intercept: real('intercept'),
  line_width: real('line_width').notNull(),
  length: real('length'),
  point1_x: real('point1_x'),
  point1_y: real('point1_y'),
  point2_x: real('point2_x'),
  point2_y: real('point2_y'),
});

export const FunctionPlotString = pgTable('function_plot_string', {
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  objId: integer('obj_id').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  position_x: real('position_x').notNull(),
  position_y: real('position_y').notNull(),
  rotation_x: real('rotation_x').notNull(),
  rotation_y: real('rotation_y').notNull(),
  rotation_z: real('rotation_z').notNull(),
  scale_x: real('scale_x').notNull(),
  scale_y: real('scale_y').notNull(),
  scale_z: real('scale_z').notNull(),
  touch_controls: jsonb('touch_controls').$type<{
    translate?: TouchControlAttributes;
    rotate?: TouchControlAttributes;
    scale?: TouchControlAttributes;
  }>(),
  XRange_a: real('x_range_a').notNull(),
  XRange_b: real('x_range_b').notNull(),
  numPoints: integer('num_points').notNull(),
  lineWidth: real('line_width').notNull(),
  functionStr: text('function_str').notNull(),
});

export const DummyDataStorage = pgTable('dummy_data_storage', {
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  objId: integer('obj_id').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  data: real('data').notNull(),
});

export const AxisObject = pgTable('axis_object', {
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  objId: integer('obj_id').notNull(),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  position_x: real('position_x').notNull(),
  position_y: real('position_y').notNull(),
  rotation_x: real('rotation_x').notNull(),
  rotation_y: real('rotation_y').notNull(),
  rotation_z: real('rotation_z').notNull(),
  scale_x: real('scale_x').notNull(),
  scale_y: real('scale_y').notNull(),
  scale_z: real('scale_z').notNull(),
  touch_controls: jsonb('touch_controls').$type<{
    translate?: TouchControlAttributes;
    rotate?: TouchControlAttributes;
    scale?: TouchControlAttributes;
  }>(),
  axisLength: real('axis_length').notNull(),
  tickSpacing: real('tick_spacing').notNull(),
  tickSize: real('tick_size').notNull(),
  showLabels: boolean('show_labels').notNull(),
  fontSize: real('font_size').notNull(),
  lineWidth: real('line_width').notNull(),
  xLabel: text('x_label').notNull(),
  yLabel: text('y_label').notNull(),
});

export type TextGeomSelect = InferSelectModel<typeof TextGeom>;
export type TextGeomInsert = InferInsertModel<typeof TextGeom>;

export type LineObjSelect = InferSelectModel<typeof LineObj>;
export type LineObjInsert = InferInsertModel<typeof LineObj>;

export type FunctionPlotStringSelect = InferSelectModel<typeof FunctionPlotString>;
export type FunctionPlotStringInsert = InferInsertModel<typeof FunctionPlotString>;

export type DummyDataStorageSelect = InferSelectModel<typeof DummyDataStorage>;
export type DummyDataStorageInsert = InferInsertModel<typeof DummyDataStorage>;

export type AxisObjectSelect = InferSelectModel<typeof AxisObject>;
export type AxisObjectInsert = InferInsertModel<typeof AxisObject>;

export type GeomObjSelect = InferSelectModel<typeof GeomObj>;
export type GeomObjInsert = InferInsertModel<typeof GeomObj>;





// export const questions = pgTable('questions', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
//     questionId: integer('question_id').notNull(),
//     questionText: text('question_text').notNull(),

//   });
  
//   export const orders = pgTable('orders', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
//     type: text('type').notNull(),
//     itemId: integer('item_id').notNull(),
//   });
  
//   export const vizobjects = pgTable('vizobjects', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}).notNull(),
//     objId: integer('obj_id').notNull(),
//     objData: jsonb('obj_data').$type<objconstructor & {type: string}>().notNull(),
//   });
  
//   export const controls = pgTable('controls', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
//     controlId: integer('control_id').notNull(),
//     controlData: jsonb('control_data').$type<ControlConstructor & {type: string}>().notNull(),
//   });
  
//   export const influences = pgTable('influences', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
//     masterId: integer('master_id').notNull(),
//     influenceData: jsonb('influence_data').$type<InfluenceConstructor<any, any, any> & {type: string}>().notNull(),
//   });
  
//   export const scores = pgTable('scores', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
//     scoreId: integer('score_id').notNull(),
//     scoreData: jsonb('score_data').$type<ScoreConstructor<any> & {type: string}>().notNull(),
//   });
  
//   export const placements = pgTable('placements', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
//     placementId: integer('placement_id').notNull(),
//     placementData: jsonb('placement_data').$type<PlacementConstructor & {type: string}>().notNull(),
//   });
  
//   export const validations = pgTable('validations', {
//     id: serial('id').primaryKey(),
//     stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
//     validationData: jsonb('validation_data').$type<ValidationConstructor & {type: string}>().notNull(),
//   });

