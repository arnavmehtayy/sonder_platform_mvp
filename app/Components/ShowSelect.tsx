import {
  useStore,
  getControlSelector,
  DeSelectObjectControl,
} from "@/app/store";
import { SelectControl } from "@/classes/SelectControl";
import React from "react";

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

  if (control) {
    return (
      <div className="p-4 bg-blue-100 shadow-md rounded-md m-2 border border-gray-300">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {control.selected.map((id: number) => (
            <div
              key={id}
              className="relative flex items-center justify-center p-2 bg-blue-500 rounded-md shadow"
            >
              <button
                className="hover-button absolute top-0 right-1 text-white hover:text-red-800"
                onClick={() => handleRemove(id)}
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
