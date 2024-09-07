import { Control } from "./Control";
import { useStore, setMultiChoiceOptionsSelector } from "@/app/store";
import Latex from "react-latex-next";



/*
 * This class is responsible for storing information about a multiple choice question
 * the attributes of this class are: options, isMultiSelect, selectedOptions
 */

export interface Option {
  id: number;
  label: string;
}

function ShowMultiChoice({control}: {control: MultiChoiceClass}) {
  const setSelectedOptions = useStore(setMultiChoiceOptionsSelector);
    const selectedOptions = control.selectedOptions;

    const handleOptionClick = (optionId: number) => {
      if (!control.isClickable) return;
      let new_options = [] as number[];
      if (control.isMultiSelect) {
        new_options = selectedOptions.includes(optionId)
          ? selectedOptions.filter((id) => id !== optionId)
          : [...selectedOptions, optionId];
      } else {
        new_options = [optionId];
      }
      setSelectedOptions(control.id, new_options);
    };

    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${!control.isClickable ? "opacity-70" : ""}`}>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          <Latex>{control.desc}</Latex>
        </h3>
        <p className="text-gray-600 mb-2">
          <Latex>{control.text}</Latex>
        </p>
        <div className="space-y-3">
          {control.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={!control.isClickable}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
                ${selectedOptions.includes(option.id)
                  ? "bg-blue-800 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
                ${!control.isClickable ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
            >
              <div className="flex items-center">
                <div className={`
                  w-5 h-5 mr-3 rounded-full border-2 flex-shrink-0
                  ${selectedOptions.includes(option.id)
                    ? "border-white bg-white"
                    : "border-blue-500 bg-transparent"
                  }
                `}>
                  {selectedOptions.includes(option.id) && (
                    <svg className="w-3 h-3 text-blue-500 mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text"><Latex>{option.label}</Latex></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  
}

export class MultiChoiceClass extends Control {
  options: Option[]; // the options of the multiple choice question
  isMultiSelect: boolean; // whether the multiple choice question allows multi option select or not
  selectedOptions: number[]; // the options that are currently selected for the multiple choice question

  constructor({
    id,
    title,
    description,
    isClickable = true,
    options,
    isMultiSelect = false,
  }: Partial<MultiChoiceClass> & {
    id: number;
    title: string;
    description: string;
    options: Option[];
  }) {
    super({ id, desc: title, text: description, isClickable });
    this.options = options;
    this.isMultiSelect = isMultiSelect;
    this.selectedOptions = []; // no options are selected initially
  }

  // change the selected options of the multiple choice question used by the storage system
  setOptions(options: number[]) { 
    const new_obj = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    new_obj.selectedOptions = options;
    return new_obj;
  }

  render(): React.ReactNode {
    return <ShowMultiChoice control={this} />;
  //   const setSelectedOptions = useStore(setMultiChoiceOptionsSelector);
  //   const selectedOptions = this.selectedOptions;

  //   const handleOptionClick = (optionId: number) => {
  //     if (!this.isClickable) return;
  //     let new_options = [] as number[];
  //     if (this.isMultiSelect) {
  //       new_options = selectedOptions.includes(optionId)
  //         ? selectedOptions.filter((id) => id !== optionId)
  //         : [...selectedOptions, optionId];
  //     } else {
  //       new_options = [optionId];
  //     }
  //     setSelectedOptions(this.id, new_options);
  //   };

  //   return (
  //     <div className={`bg-white rounded-lg shadow-lg p-6 ${!this.isClickable ? "opacity-70" : ""}`}>
  //       <h3 className="text-lg font-semibold text-blue-800 mb-2">
  //         <Latex>{this.desc}</Latex>
  //       </h3>
  //       <p className="text-gray-600 mb-2">
  //         <Latex>{this.text}</Latex>
  //       </p>
  //       <div className="space-y-3">
  //         {this.options.map((option) => (
  //           <button
  //             key={option.id}
  //             onClick={() => handleOptionClick(option.id)}
  //             disabled={!this.isClickable}
  //             className={`
  //               w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
  //               ${selectedOptions.includes(option.id)
  //                 ? "bg-blue-800 text-white shadow-md transform scale-105"
  //                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  //               }
  //               ${!this.isClickable ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
  //               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
  //             `}
  //           >
  //             <div className="flex items-center">
  //               <div className={`
  //                 w-5 h-5 mr-3 rounded-full border-2 flex-shrink-0
  //                 ${selectedOptions.includes(option.id)
  //                   ? "border-white bg-white"
  //                   : "border-blue-500 bg-transparent"
  //                 }
  //               `}>
  //                 {selectedOptions.includes(option.id) && (
  //                   <svg className="w-3 h-3 text-blue-500 mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
  //                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  //                   </svg>
  //                 )}
  //               </div>
  //               <span className="text"><Latex>{option.label}</Latex></span>
  //             </div>
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
  }

}
