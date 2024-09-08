import { Control } from "./Control";
import { obj } from "../vizobjects/obj";
import { useStore, DeSelectObjectControl,SetIsActiveSelectControl, getNameSelector  } from "@/app/store";
import React from 'react';
import Latex from 'react-latex-next';


/*
 * This is the class that holds information about the select control
 * The select control is used to select objects on the three.js screen 
 * the attributes of this class are: 
 * selectable (set of objects that can be selected), 
 * selected (the objects that have been selected), 
 * isActive (if this select has been activated using the isActive button), 
 * capacity (the total number of objects that can be selected at a time)

*/
function ShowSelectControl({control} : {control: SelectControl}) {
  const handleRemove = useStore(DeSelectObjectControl);
    const setIsActive = useStore(SetIsActiveSelectControl(control.id));
    const getName = useStore(getNameSelector);
    const [isComponentActive, setIsComponentActive] = React.useState(control.isClickable && control.isActive);

    React.useEffect(() => {
      setIsActive(isComponentActive);
    }, [isComponentActive]);

    React.useEffect(() => {
      if (control.selected.length >= control.capacity) {
        setIsComponentActive(false);
        setIsActive(false);
      }
    }, [control.selected.length, control.capacity]);

    const handleClick = () => {
      if (control.isClickable) {
        const newState = !isComponentActive;
        setIsComponentActive(newState);
        setIsActive(newState);
      }
    };

    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${!control.isClickable ? 'opacity-70' : ''} relative`}>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-blue-800">
      <Latex>{control.desc}</Latex>
    </h3>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        {control.selected.length}/{control.capacity} selected
      </span>
      <button
        onClick={handleClick}
        disabled={!control.isClickable}
        className={`
          ${isComponentActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"}
          ${!control.isClickable && "opacity-50 cursor-not-allowed"}
          text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
          flex items-center
        `}
      >
        {isComponentActive ? "Active" : "Inactive"}
      </button>
    </div>
  </div>
  
  <p className="text-gray-600 mb-4">
    <Latex>{control.text}</Latex>
  </p>
  
  <div className="space-y-3">
    {control.selected.map((id) => (
      <div
        key={id}
        className={`
          w-full text-left px-4 py-3 rounded-lg 
          transition-all duration-400 ease-out
          transform hover:scale-[1.02] active:scale-[0.98]
          bg-blue-800 text-white shadow-md
          ${!control.isClickable ? "cursor-not-allowed" : "cursor-pointer"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-3 rounded-full border-2 flex-shrink-0 border-white bg-white scale-110">
              <svg className="w-3 h-4 text-blue-800 mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-left font-medium truncate">
              {getName(id)}
            </span>
          </div>
          <button
            className="text-white hover:text-red-200 transition duration-300"
            onClick={() => handleRemove(id, control.id)}
            aria-label="Remove item"
            disabled={!control.isClickable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
    );
}
export class SelectControl extends Control {
  selectable: number[]; // This is the list of id's that a user can select using this select control
  selected: number[]; // This is the list of id's of the objects that have been selected by the user
  isActive: boolean; // This is true if the user has clicked the isActive button to activate the select control
  capacity: number; // This is the maximum number of objects that can be selected at a time

  constructor({
    id,
    selectable,
    selected = [],
    isActive = false,
    capacity = 1,
    desc = "select control",
    text = "this is a select control",
  }: Partial<SelectControl> & {
    id: number;
    selectable: number[];
  }) {
    super({ id: id, desc: desc, text: text });
    this.selectable = selectable;
    this.selected = selected;
    this.isActive = isActive;
    this.capacity = capacity;
  }

  // change if this select state has been activated using the isActive button. This is used by the storage system
  setIsActive(state: boolean): SelectControl { 
    const clone = this.clone();
    clone.isActive = state;
    return clone;
  }

  // method ot try to select an object with the given id. This is used by the storage system
  // returns a tuple with the new select control with the updated selected list and a boolean indicating if the object was successfully added
  SelectObj(obj_id: number): [SelectControl, boolean] {
    if (this.selected.length < this.capacity && this.isActive) {
      // check if obj_id does not already exist in the array
      if (!this.selected.includes(obj_id) && this.selectable.includes(obj_id)) {
        const new_selected = this.clone();
        new_selected.selected.push(obj_id);
        return [new_selected, true];
      } else {
        console.log("Object already selected or not selectable");
      }
    } else {
      console.log("Cannot select more than capacity");
    }
    return [this, false];
  }

  // method to deselect an object with the given id. This is used by the storage system
  // returns a tuple with the new select control with the updated selected list and a boolean indicating if the object was successfully removed
  deselectObj(obj_id: number): [SelectControl, boolean] {
    if (this.selected.includes(obj_id)) {
      const new_selected = this.clone();
      new_selected.selected = new_selected.selected.filter(
        (id: number) => id !== obj_id
      );
      return [new_selected, true];
    } else {
      console.log("Object was never selected");
    }
    return [this, false];
  }

  countSelected() {
    return this.selected.length;
  }

  render(): React.ReactNode {
    return <ShowSelectControl control={this} />;
    // const handleRemove = useStore(DeSelectObjectControl);
    // const setIsActive = useStore(SetIsActiveSelectControl(this.id));
    // const getName = useStore(getNameSelector);
    // const [isComponentActive, setIsComponentActive] = React.useState(this.isClickable && this.isActive);

    // React.useEffect(() => {
    //   setIsActive(isComponentActive);
    // }, [isComponentActive]);

    // React.useEffect(() => {
    //   if (this.selected.length >= this.capacity) {
    //     setIsComponentActive(false);
    //     setIsActive(false);
    //   }
    // }, [this.selected.length, this.capacity]);

    // const handleClick = () => {
    //   if (this.isClickable) {
    //     const newState = !isComponentActive;
    //     setIsComponentActive(newState);
    //     setIsActive(newState);
    //   }
    // };

    // return (
    //   <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${!this.isClickable ? 'opacity-50' : ''} relative`}>
    //     <div className="flex flex-col space-y-3">
    //       <div className="flex justify-between items-center">
    //         <h3 className="text-lg font-semibold text-blue-800"><Latex>{this.desc}</Latex></h3>
    //         <div className="flex items-center space-x-2">
    //           <span className="text-sm text-gray-600">
    //             {this.selected.length}/{this.capacity} selected
    //           </span>
    //           <button
    //             onClick={handleClick}
    //             disabled={!this.isClickable}
    //             className={`
    //               ${isComponentActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"}
    //               ${!this.isClickable && "opacity-50 cursor-not-allowed"}
    //               text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
    //               flex items-center
    //             `}
    //           >
    //             {isComponentActive ? "Active" : "Inactive"}
    //           </button>
    //         </div>
    //       </div>
    //       <p className="text-gray-600"><Latex>{this.text}</Latex></p>
    //     </div>
    //     <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    //       {this.selected.map((id) => (
    //         <div key={id} className="relative flex items-center justify-center p-3 bg-blue-100 rounded-md shadow-sm hover:shadow-md transition duration-300">
    //           <button
    //             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300 shadow-sm"
    //             onClick={() => handleRemove(id, this.id)}
    //             aria-label="Remove item"
    //             disabled={!this.isClickable}
    //           >
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    //               <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    //             </svg>
    //           </button>
    //           <span className="text-blue-800 font-medium truncate">{getName(id)}</span>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // );
  }


}
