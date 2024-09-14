import { Control } from "./Control";
import React from 'react';
import { useStore, setEnablerControl } from '@/app/store'
import Latex from 'react-latex-next';
import { useState } from "react";
import { EditableObjectPopup, EditableObjectPopupProps } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { ControlConstructor } from "./Control";


export interface EnablerControlConstructor extends ControlConstructor {
  obj_ids: number[];
  ControlState?: boolean;
}

function ShowEnablerControl({control}: {control: EnablerControl}) {
    const isActive = control.isClickable;
    const [isComponentActive, setIsComponentActive] = useState<boolean>(control.ControlState);
    const setIsActive = useStore(setEnablerControl(control.id));

    const handleClick = () => {
      setIsComponentActive((old) => !old);
      setIsActive(!isComponentActive);
    };

    return (
      <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${!isActive ? 'opacity-50' : ''} relative`}>
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">
              <Latex>{control.desc}</Latex>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClick}
                disabled={!isActive}
                className={`
                  ${isComponentActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"}
                  ${!isActive && "opacity-50 cursor-not-allowed"}
                  text-white py-1 px-3 rounded-md text-sm font-medium 
                  transition duration-300 ease-in-out
                  flex items-center
                `}
              >
                {isComponentActive ? "Deactivate" : "Click Here!"}
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            <Latex>{control.text}</Latex>
          </p>
        </div>
      </div>
    );
  
}

/*

 * This is the class that holds information about the enabler control
 * The enabler control is used to enable or disable vizobject on the screen
 * the attributes of this class are: obj_ids, ControlState

*/

export class EnablerControl extends Control {
  obj_ids: number[]; // vizobjects that this enabler can enable or disable
  ControlState: boolean; // the current enabled/disabled state of the enabler
  constructor({
    id,
    desc = "control_Enabler",
    text = "this is a description of an enabler control",
    obj_ids,
  }: Partial<EnablerControlConstructor> & {
    id: number;
    obj_ids: number[];
  }) {
    super({ id: id, desc: desc, text: text }); 
    this.obj_ids = obj_ids;
    this.ControlState = false; // objects start of invisible
  }

  // change the enabled/disabled state of the enabler control used by the storage system
  setControlState(state: boolean) { 
    const newControl = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    newControl.ControlState = state;
    return newControl;
  }

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: EnablerControl) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<EnablerControlConstructor>({
      id: Date.now(),
      obj_ids: [],
      desc: "control_Enabler",
      text: "this is a description of an enabler control",
    });

    const handleChange = (field: string, value: any) => {
      setEditedObject((prev) => ({ ...prev, [field]: value }));
    };

    
    const popupProps: EditableObjectPopupProps<EnablerControlConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: EnablerControlConstructor) => {
        const newObj = new EnablerControl(updatedObject);
        onSave(newObj);
      },
      title: `Create New Enabler Control`,
      fields: [
        { key: "desc", label: "Title", type: "title" },
        { key: "text", label: "Description", type: "textarea" },
        { key: "obj_ids", label: "Options", type: "vizObjSelectList" },
      ],
      
    };

    return <EditableObjectPopup {...popupProps} />;
  }

  // this is the rendering for the EnablerControl on the sidebar it also controls the state of the control in the state management system
  render(): React.ReactNode {
    return <ShowEnablerControl control={this} />;
    // const control = this;
    // const isActive = control.isClickable;
    // const [isComponentActive, setIsComponentActive] = useState<boolean>(control.ControlState);
    // const setIsActive = useStore(setEnablerControl(control.id));

    // const handleClick = () => {
    //   setIsComponentActive((old) => !old);
    //   setIsActive(!isComponentActive);
    // };

    // return (
    //   <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${!isActive ? 'opacity-50' : ''} relative`}>
    //     <div className="flex flex-col space-y-3">
    //       <div className="flex justify-between items-center">
    //         <h3 className="text-lg font-semibold text-blue-800">
    //           <Latex>{this.desc}</Latex>
    //         </h3>
    //         <div className="flex items-center space-x-2">
    //           <button
    //             onClick={handleClick}
    //             disabled={!isActive}
    //             className={`
    //               ${isComponentActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"}
    //               ${!isActive && "opacity-50 cursor-not-allowed"}
    //               text-white py-1 px-3 rounded-md text-sm font-medium 
    //               transition duration-300 ease-in-out
    //               flex items-center
    //             `}
    //           >
    //             {isComponentActive ? "Deactivate" : "Click Here!"}
    //           </button>
    //         </div>
    //       </div>
    //       <p className="text-gray-600">
    //         <Latex>{control.text}</Latex>
    //       </p>
    //     </div>
    //   </div>
    // );
    
  
  }
}
