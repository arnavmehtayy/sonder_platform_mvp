import { obj, object_types } from "./vizobjects/obj";
import { FunctionStr } from "./Controls/FunctionStr";
import { atts } from "./vizobjects/get_set_obj_attributes";
import { useStore } from "@/app/store";
import { Influence } from "./influence";
import { AttributePairsEditor } from "./Controls/SliderControlAdv";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { InfluenceAdvancedInsert, InfluenceAdvancedSelect, InfluenceAttributePairsInsert, InfluenceAttributePairsSelect } from "@/app/db/schema";
import React from "react";

export interface AttributePairSet {
  transform_function: FunctionStr;
  set_attribute: (obj: any, value: any) => any;
}

export interface AttributePairSet_json {
  transform_function: FunctionStr;
  func: string;
  obj_type: object_types;
}

export interface InfluenceAdvancedConstructor {
  influence_id: number;
  worker_id: number;
  attribute_pairs: AttributePairSet_json[];
}

export class InfluenceAdvanced extends Influence<number, obj, obj> {
  attribute_pairs: AttributePairSet[];
  attribute_JSON: AttributePairSet_json[];
  masterIds: number[];

  constructor({
    influence_id,
    worker_id,
    attribute_pairs,
  }: InfluenceAdvancedConstructor) {
    // Get all unique object IDs from function symbols

    console.log(influence_id, worker_id, attribute_pairs)
    const masterIds = Array.from(new Set(
      attribute_pairs.flatMap(pair => 
        pair.transform_function.symbols
          .map(symbol => symbol.obj_id)
          .filter((id): id is number => id !== undefined)
      )
    ));

    super({
      influence_id,
      master_id: masterIds[0] ?? -1, // Keep first one as primary for base class
      worker_id,
      get_attribute: () => 0,
      set_attribute: (obj) => obj,
      transformation: (val) => val,
    });

    this.masterIds = masterIds;
    this.attribute_pairs = attribute_pairs.map((pair: AttributePairSet_json) => ({
      transform_function: pair.transform_function,
      set_attribute: atts[pair.obj_type]!["number"][pair.func].set_attribute
    }));
    this.attribute_JSON = attribute_pairs;
  }

  // Add method to register influence with store
  registerWithStore(store: typeof useStore): void {
    const state = store.getState();
    
    // Register this influence with all master objects
    this.masterIds.forEach(masterId => {
      const influences = state.influences[masterId] || [];
      if (!influences.includes(this)) {
        store.setState(state => ({
          influences: {
            ...state.influences,
            [masterId]: [...influences, this]
          }
        }));
      }
    });
    console.log("STATE THINGS", useStore.getState().influenceAdvIndex)
  }

  // Make UpdateInfluence compatible with base class
  static UpdateInfluence<T, master_T extends obj, worker_T extends obj>(
    influence: Influence<T, master_T, worker_T>,
    master: master_T,
    worker: worker_T
  ): worker_T {
    
    if (influence instanceof InfluenceAdvanced) {
      return influence.attribute_pairs.reduce((updatedObj, pair) => {
        const value = pair.transform_function.get_function()(0, useStore.getState);
        return pair.set_attribute(updatedObj, value);
      }, worker) as worker_T;
    }

    // Fall back to base class behavior if not InfluenceAdvanced
    return Influence.UpdateInfluence(influence, master, worker);
  }

  serialize(): [Omit<InfluenceAdvancedInsert, 'stateId'>, Omit<InfluenceAttributePairsInsert, 'stateId'>[]] {
    const influenceData: Omit<InfluenceAdvancedInsert, 'stateId'> = {
      influence_id: this.influence_id,
      worker_id: this.worker_id,
    };

    const attributePairs = this.attribute_JSON.map(pair => ({
      InfluenceId: this.influence_id,
      trans_functionStr: pair.transform_function.functionString,
      trans_symbols: pair.transform_function.symbols,
      get_func: pair.func,
      obj_type: pair.obj_type
    }));

    return [influenceData, attributePairs];
  }

  static deserialize(data: InfluenceAdvancedSelect, attributePairs: InfluenceAttributePairsSelect[]): InfluenceAdvanced {
    const attribute_pairs: AttributePairSet_json[] = attributePairs.map(pair => ({
      transform_function: new FunctionStr(pair.trans_functionStr, pair.trans_symbols),
      func: pair.get_func,
      obj_type: pair.obj_type
    }));

    return new InfluenceAdvanced({
      influence_id: data.influence_id,
      worker_id: data.worker_id,
      attribute_pairs: attribute_pairs
    });
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: InfluenceAdvanced) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<InfluenceAdvancedConstructor>({
      influence_id: Date.now() % 10000,
      worker_id: -1,
      attribute_pairs: [],
    });

    const handleSave = (updatedObject: InfluenceAdvancedConstructor) => {
      const newObj = new InfluenceAdvanced(updatedObject);
      // Register with store when created
      newObj.registerWithStore(useStore);
      onSave(newObj);
    };

    const popupProps: EditableObjectPopupProps<InfluenceAdvancedConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: handleSave,
      title: `Create New Influence`,
      fields: [
        {
          key: "worker_id",
          label: "Worker Object",
          type: "vizObjSelect",
        },
        {
          key: "attribute_pairs",
          label: "Influenced Attributes",
          type: "custom",
          render: (value, onChange) => (
            <AttributePairsEditor
              pairs={value}
              onChange={onChange}
              objectId={editedObject.worker_id}
            />
          ),
        },
      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }

  // Add a getter for all object IDs this influence depends on
  get dependencyIds(): number[] {
    return Array.from(new Set(
      this.attribute_pairs.flatMap(pair => 
        pair.transform_function.symbols
          .map(symbol => symbol.obj_id)
          .filter((id): id is number => id !== undefined)
      )
    ));
  }
}