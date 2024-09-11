// 'use client'
// import { useStore, getObjectsSelector} from "@/app/store";
// import { obj } from "@/classes/vizobjects/obj";

// export function SelectObjPopup({
//   handleChange,
// }: {
//   handleChange: (val: number) => void;
// }) {
//     const objects = useStore(getObjectsSelector);
//     return (
//         <div>
//             <select onChange={(e) => handleChange(parseInt(e.target.value))}>
//                 {objects.map((obj, i) => (
//                     <option value={i}>{obj.name}</option>
//                 ))}
//             </select>
//         </div>
//     );

// }
