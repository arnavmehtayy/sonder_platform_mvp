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
    setIsActive(isDark);
  }, []);

  const handleClick = () => {
    setIsDark(!isDark);
    setIsActive(!isDark);
  };

  if (control) {
    return (
      <div className="p-5 bg-blue-100 shadow-md rounded-md m-2 border border-gray-300">
        <div className="flex justify-start mb-4">
          <button
            onClick={handleClick}
            className={`${
              isDark ? "bg-blue-900" : "bg-blue-500"
            } text-white py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            Select
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {control.selected.map((id: number) => (
            <div
              key={id}
              className="relative flex items-center justify-center p-4 bg-blue-500 rounded-md shadow h-40 w-full"
            >
              <button
                className="hover-button absolute top-0 right-1 text-white hover:text-red-800"
                onClick={() => handleRemove(id, control_id)}
              >
                &times;
              </button>
              {id}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
