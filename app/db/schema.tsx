import { ControlConstructor } from '@/classes/Controls/Control';
import { InfluenceConstructor } from '@/classes/influence';
import { PlacementConstructor } from '@/classes/Placement';
import { ScoreConstructor } from '@/classes/Scores/Score';
import { ValidationConstructor } from '@/classes/Validation/Validation';
import { objconstructor } from '@/classes/vizobjects/obj';
import { integer, real, pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';


export const states = pgTable('users_table', {
  id: serial('id').primaryKey(),
  state_name: text('state_name').notNull().unique(),
  camera_zoom: real("camera_zoom").default(20.0),
  title: text("title").notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
});

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    questionId: integer('question_id').notNull(),
    questionText: text('question_text').notNull(),
  });
  
  export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
    type: text('type').notNull(),
    itemId: integer('item_id').notNull(),
  });
  
  export const vizobjects = pgTable('vizobjects', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}).notNull(),
    objId: integer('obj_id').notNull(),
    objData: jsonb('obj_data').$type<objconstructor & {type: string}>().notNull(),
  });
  
  export const controls = pgTable('controls', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
    controlId: integer('control_id').notNull(),
    controlData: jsonb('control_data').$type<ControlConstructor & {type: string}>().notNull(),
  });
  
  export const influences = pgTable('influences', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
    masterId: integer('master_id').notNull(),
    influenceData: jsonb('influence_data').$type<InfluenceConstructor<any, any, any> & {type: string}>().notNull(),
  });
  
  export const scores = pgTable('scores', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
    scoreId: integer('score_id').notNull(),
    scoreData: jsonb('score_data').$type<ScoreConstructor<any> & {type: string}>().notNull(),
  });
  
  export const placements = pgTable('placements', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
    placementId: integer('placement_id').notNull(),
    placementData: jsonb('placement_data').$type<PlacementConstructor & {type: string}>().notNull(),
  });
  
  export const validations = pgTable('validations', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').notNull().references(() => states.id, {onDelete:'cascade'}),
    validationData: jsonb('validation_data').$type<ValidationConstructor & {type: string}>().notNull(),
  });

