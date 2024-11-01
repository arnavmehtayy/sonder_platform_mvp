import { ControlConstructor } from '@/classes/Controls/Control';
import { TouchControlAttributes } from '@/classes/Controls/TouchControl';
import { InfluenceConstructor } from '@/classes/influence';
import { PlacementConstructor } from '@/classes/Placement';
import { ScoreConstructor } from '@/classes/Scores/Score';
import { ValidationConstructor } from '@/classes/Validation/Validation';
import { geom_param_type, geom_type, PredefinedGeometry } from '@/classes/vizobjects/geomobj';
import { objconstructor, object_types } from '@/classes/vizobjects/obj';
import { integer, boolean, real, pgTable, serial, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { pgSchema } from 'drizzle-orm/pg-core';

// VIZOBJECTS

const authSchema = pgSchema('auth');

const users = authSchema.table('users', {
	id: uuid('id').primaryKey(),
});

export const profiles = pgTable('profiles', {
	id: serial('id').primaryKey(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
	firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
});


export type ProfileSelect = InferSelectModel<typeof profiles>;
export type ProfileInsert = InferInsertModel<typeof profiles>;

export const experience = pgTable('experience_table', {
  id: serial('id').primaryKey(),
  desc: text('desc').notNull(),
  title: text('title').notNull(),
  user_id: integer('user_id').references(() => profiles.id).notNull(), // foreign key to the profile
})

export type ExperienceSelect = InferSelectModel<typeof experience>;
export type ExperienceInsert = InferInsertModel<typeof experience>;


export const states = pgTable('users_table', {
  id: serial('id').primaryKey(),
  state_name: text('state_name').notNull().unique(),
  camera_zoom: real("camera_zoom").default(20.0),
  title: text("title").notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  experienceId: integer('experience_id').references(() => experience.id, { onDelete: 'cascade' }).notNull(),
  index: integer('index').default(0)
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
import { AttributePairGet } from '@/classes/Controls/FunctionStr';
import { SideBarComponentType } from '../store';
import { objectScorer } from '@/classes/Scores/objectScorer';
import { Attribute_get, relation } from '@/classes/Validation/Validation_obj';
import { att_type } from '@/classes/vizobjects/get_set_obj_attributes';

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
  symbols: jsonb('symbols').$type<AttributePairGet[]>().notNull(),
  axisId: integer('axis_id').default(-1),
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
  isNumberLine: boolean('is_number_line').notNull().default(false),
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

// VIZOBJECTS

// ORDER
export const order = pgTable('order', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').$type<SideBarComponentType>().notNull(),
  itemId: integer('item_id').notNull(),
});

export type OrderSelect = InferSelectModel<typeof order>;
export type OrderInsert = InferInsertModel<typeof order>;


// CONTROLS

export const TableControl = pgTable('table_control', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  controlId: integer('control_id').notNull(),
  desc: text('desc').notNull(),
  text: text('text').notNull(),
  columnHeaders: text('column_headers').array().notNull(),
  rowHeaders: text('row_headers').array().notNull(),
});

export const TableCell = pgTable('table_cell', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  tableControlId: integer('table_control_id').references(() => TableControl.id, { onDelete: 'cascade' }).notNull(),
  rowIndex: integer('row_index').notNull(),
  columnIndex: integer('column_index').notNull(),
  value: real('value').notNull(),
  trans_functionStr: text('trans_functionStr').notNull(),
  trans_symbols: jsonb('trans_symbols').$type<AttributePairGet[]>().notNull(),
  objId: integer('obj_id').notNull(),
  objType: text('obj_type').$type<object_types>().notNull(),
  attribute: text('attribute').notNull(),
  isStatic: boolean('is_static').notNull(),
});


export type TableCellSelect = InferSelectModel<typeof TableCell>;
export type TableCellInsert = InferInsertModel<typeof TableCell>;


export const SelectControl = pgTable('select_control', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  controlId: integer('control_id').notNull(),
  desc: text('desc').notNull(),
  text: text('text').notNull(),
  selectable: integer('selectable').array().notNull(),
  selected: integer('selected').array().notNull(),
  isActive: boolean('is_active').notNull(),
  capacity: integer('capacity').notNull(),
});

export const EnablerControl = pgTable('enabler_control', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  controlId: integer('control_id').notNull(),
  desc: text('desc').notNull(),
  text: text('text').notNull(),
  obj_ids: integer('obj_ids').array().notNull(),
  ControlState: boolean('control_state').notNull(),
});


// for each SliderControlAdvanced you also need to go to the AttributePair table and pick
// out the corresponding list of attribute pairs to attach to it.
export const SliderControlAdvanced = pgTable('slider_control_advanced', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  controlId: integer('control_id').notNull(),
  desc: text('desc').notNull(),
  text: text('text').notNull(),
  obj_id: integer('obj_id').notNull(),
  range: jsonb('range').$type<[number, number]>().notNull(),
  step_size: real('step_size').notNull(),
});

export const AttributePairs = pgTable('attribute_pairs', {
  id: serial('id').primaryKey(),
  ControlId: integer('control_id').references(() => SliderControlAdvanced.id, { onDelete: 'cascade' }).notNull(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  trans_functionStr: text('trans_functionStr').notNull(),
  trans_symbols: jsonb('trans_symbols').$type<AttributePairGet[]>().notNull(),
  get_func: text('func').notNull(),
  obj_type: text('obj_type').$type<object_types>().notNull(),
});



export type SliderControlAdvancedSelect = InferSelectModel<typeof SliderControlAdvanced>;
export type SliderControlAdvancedInsert = InferInsertModel<typeof SliderControlAdvanced>;

export type AttributePairsSelect = InferSelectModel<typeof AttributePairs>;
export type AttributePairsInsert = InferInsertModel<typeof AttributePairs>;

export const MultiChoiceControl = pgTable('multi_choice_control', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  controlId: integer('control_id').notNull(),
  desc: text('desc').notNull(),
  text: text('text').notNull(),
  isMultiSelect: boolean('is_multi_select').notNull(),
});

export const MultiChoiceOption = pgTable('multi_choice_option', {
  id: serial('id').primaryKey(),
  multiChoiceControlId: integer('multi_choice_control_id').references(() => MultiChoiceControl.id, { onDelete: 'cascade' }).notNull(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  label: text('label').notNull(),
});

export type MultiChoiceControlSelect = InferSelectModel<typeof MultiChoiceControl>;
export type MultiChoiceControlInsert = InferInsertModel<typeof MultiChoiceControl>;

export type MultiChoiceOptionSelect = InferSelectModel<typeof MultiChoiceOption>;
export type MultiChoiceOptionInsert = InferInsertModel<typeof MultiChoiceOption>;

export const InputNumberControl = pgTable('input_number_control', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  controlId: integer('control_id').notNull(),
  desc: text('desc').notNull(),
  text: text('text').notNull(),
  value: real('value'),
  placeholder: text('placeholder'),
  initial_value: real('initial_value'),
  min: real('min'),
  max: real('max'),
  step: real('step'),
  obj_id: integer('obj_id'),
});

export const InputNumberAttributePairs = pgTable('input_number_attribute_pairs', {
  id: serial('id').primaryKey(),
  ControlId: integer('control_id').references(() => InputNumberControl.id, { onDelete: 'cascade' }).notNull(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  trans_functionStr: text('trans_functionStr').notNull(),
  trans_symbols: jsonb('trans_symbols').$type<AttributePairGet[]>().notNull(),
  get_func: text('func').notNull(),
  obj_type: text('obj_type').$type<object_types>().notNull(),
});

export type InputNumberAttributePairsSelect = InferSelectModel<typeof InputNumberAttributePairs>;
export type InputNumberAttributePairsInsert = InferInsertModel<typeof InputNumberAttributePairs>;


export type InputNumberControlSelect = InferSelectModel<typeof InputNumberControl>;
export type InputNumberControlInsert = InferInsertModel<typeof InputNumberControl>;



// // Add these type definitions at the end of the file
export type TableControlSelect = InferSelectModel<typeof TableControl>;
export type TableControlInsert = InferInsertModel<typeof TableControl>;

export type SelectControlSelect = InferSelectModel<typeof SelectControl>;
export type SelectControlInsert = InferInsertModel<typeof SelectControl>;

export type EnablerControlSelect = InferSelectModel<typeof EnablerControl>;
export type EnablerControlInsert = InferInsertModel<typeof EnablerControl>;

// export type SliderControlAdvancedSelect = InferSelectModel<typeof SliderControlAdvanced>;
// export type SliderControlAdvancedInsert = InferInsertModel<typeof SliderControlAdvanced>;

// export type MultiChoiceControlSelect = InferSelectModel<typeof MultiChoiceControl>;
// export type MultiChoiceControlInsert = InferInsertModel<typeof MultiChoiceControl>;





// Score

export const FunctionScore = pgTable('function_score', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  scoreId: integer('score_id').notNull(),
  text: text('text').notNull(),
  desc: text('desc').notNull(),
  functionStr: text('function_str').notNull(),
  functionSymbols: jsonb('function_symbols').$type<AttributePairGet[]>().notNull(),
});

export type FunctionScoreSelect = InferSelectModel<typeof FunctionScore>;
export type FunctionScoreInsert = InferInsertModel<typeof FunctionScore>;







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

export const ValidationObj = pgTable('validation_obj', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  desc: text('desc').notNull(),
  answer: jsonb('answer').$type<att_type>().notNull(),
  obj_id: integer('obj_id').notNull(),
  get_attribute_json: jsonb('get_attribute_json').$type<Attribute_get>().notNull(),
  error: real('error'),
  relation: text('relation').$type<relation>().notNull(),
});

export const ValidationTableControl = pgTable('validation_table_control', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  desc: text('desc').notNull(),
  answers: jsonb('answers').$type<number[][]>().notNull(),
  control_id: integer('control_id').notNull(),
  error: real('error').notNull(),
  validateCells: jsonb('validate_cells').$type<boolean[][]>().notNull(),
});

export const ValidationScore = pgTable('validation_score', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  desc: text('desc').notNull(),
  score_id: integer('score_id').notNull(),
  target_score: jsonb('target_score').notNull(),
  error: real('error').notNull(),
  relation: text('relation').$type<relation>().notNull(),
});

export const ValidationSlider = pgTable('validation_slider', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  desc: text('desc').notNull(),
  control_id: integer('control_id').notNull(),
  target_value: real('target_value').notNull(),
  error: real('error').notNull(),
  relation: text('relation').$type<relation>().notNull(),
});

export const ValidationSelect = pgTable('validation_select', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  desc: text('desc').notNull(),
  answer: integer('answer').array().notNull(),
  control_id: integer('control_id').notNull(),
});

// Add type definitions
export type ValidationObjSelect = InferSelectModel<typeof ValidationObj>;
export type ValidationObjInsert = InferInsertModel<typeof ValidationObj>;

export type ValidationTableControlSelect = InferSelectModel<typeof ValidationTableControl>;
export type ValidationTableControlInsert = InferInsertModel<typeof ValidationTableControl>;

export type ValidationScoreSelect = InferSelectModel<typeof ValidationScore>;
export type ValidationScoreInsert = InferInsertModel<typeof ValidationScore>;

export type ValidationSliderSelect = InferSelectModel<typeof ValidationSlider>;
export type ValidationSliderInsert = InferInsertModel<typeof ValidationSlider>;

export type ValidationSelectSelect = InferSelectModel<typeof ValidationSelect>;
export type ValidationSelectInsert = InferInsertModel<typeof ValidationSelect>;

export const Placement = pgTable('placement', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  placementId: integer('placement_id').notNull(),
  object_ids: integer('object_ids').array().notNull(),
  grid: integer('grid').array().notNull(),
  cellSize: real('cell_size').notNull(),
  geometry_json: jsonb('geometry_json').$type<PredefinedGeometry>().notNull(),
  gridVectors: jsonb('grid_vectors').$type<{x: number, y: number}[]>().notNull(),
  text: text('text').notNull(),
  desc: text('desc').notNull(),
  color: text('color').notNull(),
  isClickable: boolean('is_clickable').notNull(),
  max_placements: integer('max_placements').notNull(),
});

export const Questions_text = pgTable('question_text', {
  id: serial('id').primaryKey(),
  stateId: integer('state_id').references(() => states.id, { onDelete: 'cascade' }).notNull(),
  questionId: integer('placement_id').notNull(),
  text: text('text').notNull(),
})

// Add type definitions
export type PlacementSelect = InferSelectModel<typeof Placement>;
export type PlacementInsert = InferInsertModel<typeof Placement>;

export type QuestionTextSelect = InferSelectModel<typeof Questions_text>;
export type QuestionTextInsert = InferInsertModel<typeof Questions_text>;






