import { obj } from "./obj";
import { DummyDataInput } from "@/app/Components/EditMode/EditPopups/DummyDataInput";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import React from "react";
import { dict_keys, Dummy_atts, get_attributes } from "./get_set_obj_attributes";

/*
 * this is a invisible object on the scene that stores some data
 * this can be used to store intermediate that needs to be used by other objects (think of them as intermediate computations)
*/
export type DummyDataSupportedTypes =
  | number
  | string
  | boolean
  | number[]
  | string[];


interface DummyDataStorageConstructor<T extends DummyDataSupportedTypes> {
  id: number;
  name: string;
  data: T;
}

export class DummyDataStorage<T extends DummyDataSupportedTypes> extends obj {
  data: T;
  constructor({ id, name, data }: DummyDataStorageConstructor<T>) {
    super({ id: id, name: name, isEnabled: true });
    this.data = data;
    this.type = "DummyDataStorage";
  }

  get_set_att_selector(type: dict_keys): {[key: string]: get_attributes<any, any>} {
    if (typeof this.data === 'number') {
      return { ...Dummy_atts[type], ...super.get_set_att_selector(type) };
    } else {
      return {};
    }
  }

  // method to set the data for this data storage object
  // used by the storage system
  static setData<T extends DummyDataSupportedTypes>(
    obj: DummyDataStorage<T>,
    data: T
    
  ): DummyDataStorage<T> {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    newObj.data = data;
    return newObj;
  }

  dataBaseSave(): DummyDataStorageConstructor<T> & {type: string} {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      type: 'DummyDataStorage'
    };
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: DummyDataStorage<any>) => void;
  }): React.ReactElement {
    const [editedObject, setEditedObject] = React.useState<DummyDataStorageConstructor<any> & { dataType: string }>({
      id: Date.now() % 10000,
      name: "",
      data: null,
      dataType: "number",
    });

    const popupProps: EditableObjectPopupProps<DummyDataStorageConstructor<any> & { dataType: string }> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject) => {
        let typedData: any;
        switch (updatedObject.dataType) {
          case "number":
            typedData = Number(updatedObject.data);
            break;
          case "string":
            typedData = String(updatedObject.data);
            break;
          case "boolean":
            typedData = Boolean(updatedObject.data);
            break;
          case "number[]":
            typedData = updatedObject.data.split(',').map(Number);
            break;
          case "string[]":
            typedData = updatedObject.data.split(',');
            break;
        }
        const newObj = new DummyDataStorage({
          id: updatedObject.id,
          name: updatedObject.name,
          data: typedData,
        });
        onSave(newObj);
      },
      title: `Create New Dummy Data Storage`,
      fields: [
        { key: "name", label: "Name", type: "text" },
        {
          key: "dataType",
          label: "Data Type",
          type: "select",
          options: [
            { label: "Number", value: "number" },
            { label: "String", value: "string" },
            { label: "Boolean", value: "boolean" },
            { label: "Number Array", value: "number[]" },
            { label: "String Array", value: "string[]" },
          ],
        },
        {
          key: "data",
          label: "Data",
          type: "custom",
          render: (value, onChange) => (
            <DummyDataInput
              value={value}
              onChange={onChange}
              dataType={editedObject.dataType}
            />
          ),
        },
      ],
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}
