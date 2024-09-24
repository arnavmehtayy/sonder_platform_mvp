import {obj} from '@/classes/vizobjects/obj';
import coloredObj from '@/classes/vizobjects/coloredObj';
import CoordinateAxis from '@/classes/vizobjects/CoordinateAxis';
import { DummyDataStorage } from '@/classes/vizobjects/DummyDataStore';
import FunctionPlot from '@/classes/vizobjects/FunctionPlot';
import FunctionPlotString from '@/classes/vizobjects/FunctionPlotString';
import { geomobj } from '@/classes/vizobjects/geomobj';
import { LineObj } from '@/classes/vizobjects/Lineobj';
import TextGeom from '@/classes/vizobjects/textgeomObj';
import { TransformObj } from '@/classes/vizobjects/transformObj';


import { Control } from '@/classes/Controls/Control'
import { EnablerControl } from '@/classes/Controls/EnablerControl';
import { InputNumber } from '@/classes/Controls/InputNumber';
import { MultiChoiceClass } from '@/classes/Controls/MultiChoiceClass';
import { SelectControl } from '@/classes/Controls/SelectControl';
import { SliderControl } from '@/classes/Controls/SliderControl';
import { SliderControlAdvanced } from '@/classes/Controls/SliderControlAdv';
import { SlideContTrans } from '@/classes/Controls/SliderContTrans';
import { TableControl } from '@/classes/Controls/TableControl';

import { Score } from '@/classes/Scores/Score';

import Validation_obj from '@/classes/Validation/Validation_obj';
import Validation_score from '@/classes/Validation/Validation_score';
import Validation_select from '@/classes/Validation/Validation_select';
import Validation_test from '@/classes/Validation/Validation_test';
import { Validation_tableControl } from '@/classes/Validation/Validation_tableControl';
import { Validation_inputNumber } from '@/classes/Validation/Validation_inputNumber';
import Validation from '@/classes/Validation/Validation';
import { ValidationMultiChoice } from '@/classes/Validation/ValidationMultiChoice';


import Placement from '@/classes/Placement';

export const constructors = {
    // VizObjects
    'Obj': obj,
    'ColoredObj': coloredObj,
    'CoordinateAxis': CoordinateAxis,
    'DummyDataStorage': DummyDataStorage,
    'FunctionPlot': FunctionPlot,
    'FunctionPlotString': FunctionPlotString,
    'Geomobj': geomobj,
    'LineObj': LineObj,
    'TextGeom': TextGeom,
    'TransformObj': TransformObj,

    // Controls
    'Control': Control,
    'EnablerControl': EnablerControl,
    'InputNumber': InputNumber,
    'MultiChoiceClass': MultiChoiceClass,
    'SelectControl': SelectControl,
    'SliderControl': SliderControl,
    'SliderControlAdvanced': SliderControlAdvanced,
    'SlideContTrans': SlideContTrans,
    'TableControl': TableControl,

    // Scores
    'Score': Score,

    // Validations
    'Validation': Validation,
    'Validation_obj': Validation_obj,
    'Validation_score': Validation_score,
    'Validation_select': Validation_select,
    'Validation_test': Validation_test,
    'Validation_tableControl': Validation_tableControl,
    'Validation_inputNumber': Validation_inputNumber,
    'ValidationMultiChoice': ValidationMultiChoice,

    // Placement
    'Placement': Placement,

    // influence
    



  };