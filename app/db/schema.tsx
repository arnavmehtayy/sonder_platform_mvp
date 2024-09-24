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
    questionId: integer('question_id'),
    questionText: text('question_text'),
  });
  
  export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    type: text('type'),
    itemId: integer('item_id'),
  });
  
  export const vizobjects = pgTable('vizobjects', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    objId: integer('obj_id'),
    objData: jsonb('obj_data'),
    constructor: text('constructor'),
  });
  
  export const controls = pgTable('controls', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    controlId: integer('control_id'),
    controlData: jsonb('control_data'),
    constructor: text('constructor'),
  });
  
  export const influences = pgTable('influences', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    masterId: integer('master_id'),
    influenceData: jsonb('influence_data'),
    constructor: text('constructor'),
  });
  
  export const scores = pgTable('scores', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    scoreId: integer('score_id'),
    scoreData: jsonb('score_data'),
    constructor: text('constructor'),
  });
  
  export const placements = pgTable('placements', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    placementId: integer('placement_id'),
    placementData: jsonb('placement_data'),
    constructor: text('constructor'),
  });
  
  export const validations = pgTable('validations', {
    id: serial('id').primaryKey(),
    stateId: integer('state_id').references(() => states.id, {onDelete:'cascade'}),
    validationData: jsonb('validation_data'),
    constructor: text('constructor'),
  });

