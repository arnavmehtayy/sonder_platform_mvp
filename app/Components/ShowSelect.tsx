import {
  useStore,
  getControlSelector,
  DeSelectObjectControl,
  SetIsActiveControl,
} from "@/app/store";
import { SelectControl } from "@/classes/SelectControl";
import React, { useEffect, useState } from "react";

// export function ShowSelect({ control_id }: { control_id: number }) {
//     const control = useStore(getControlSelector(control_id)) as SelectControl;
//     if (control) {
//       return (
//         <div className="p-4 bg-white shadow-md rounded-md m-2 border border-gray-300">
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
//             {control.selected.map((id: number) => (
//               <div
//                 key={id}
//                 className="flex items-center justify-center p-2 bg-blue-100 rounded-md shadow"
//               >
//                 {id}
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     } else {
//       return null;
//     }
//   }

export function ShowSelect({ control_id }: { control_id: number }) {
  const control = useStore(getControlSelector(control_id)) as SelectControl;
  const handleRemove = useStore(DeSelectObjectControl);
  const setIsActive = useStore(SetIsActiveControl(control_id));
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if(control) {
    setIsActive(isDark);
    }
  }, []);

  const handleClick = () => {
    setIsDark(!isDark);
    setIsActive(!isDark);
  };

  if (control) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-blue-800">Selection {control_id}</h3>
          <button
            onClick={handleClick}
            className={`${
              isDark ? "bg-blue-600" : "bg-gray-400"
            } text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out`}
          >
            {isDark ? "Active" : "Inactive"}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {control.selected.map((id) => (
            <div
              key={id}
              className="relative flex items-center justify-center p-2 bg-blue-100 rounded-md"
            >
              <button
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                onClick={() => handleRemove(id, control_id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-blue-800 font-medium">{id}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
