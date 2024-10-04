// import { obj } from "./vizobjects/obj";
// import { FunctionStr, FunctionStrEditor } from './Controls/FunctionStr';
// import { atts } from './vizobjects/get_set_obj_attributes';
// import React from 'react';
// import {
//   EditableObjectPopup,
//   EditableObjectPopupProps,
// } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// export interface InfluenceAdvConstructor<T, worker_T extends obj> {
//   influence_id: number;
//   worker_id: number;
//   functionStr: FunctionStr;
//   set_attribute: (vizobj: worker_T, value: T) => worker_T;
// }

// export class InfluenceAdv<T, worker_T extends obj> {
//   influence_id: number;
//   worker_id: number;
//   functionStr: FunctionStr;
//   set_attribute: (vizobj: worker_T, value: T) => worker_T;

//   constructor({
//     influence_id,
//     worker_id,
//     functionStr,
//     set_attribute,
//   }: InfluenceAdvConstructor<T, worker_T>) {
//     this.influence_id = influence_id;
//     this.worker_id = worker_id;
//     this.functionStr = functionStr;
//     this.set_attribute = set_attribute;
//   }

//   static UpdateInfluence<T, worker_T extends obj>(
//     influence: InfluenceAdv<T, worker_T>,
//     worker: worker_T,
//     getState: () => any
//   ) {
//     const value = influence.functionStr.get_function()(0, getState);
//     return influence.set_attribute(worker, value as T);
//   }

//   dataBaseSave(): InfluenceAdvConstructor<T, worker_T> & {type: string} {
//     return {
//       influence_id: this.influence_id,
//       worker_id: this.worker_id,
//       functionStr: this.functionStr,
//       set_attribute: this.set_attribute,
//       type: "influenceAdv"
//     };
//   }

//   static getPopup<T, worker_T extends obj>({
//     isOpen,
//     onClose,
//     onSave,
//     worker_id,
//   }: {
//     isOpen: boolean;
//     onClose: () => void;
//     onSave: (obj: InfluenceAdv<T, worker_T>) => void;
//     worker_id: number;
//   }) {
//     const [editedObject, setEditedObject] = React.useState<InfluenceAdvConstructor<T, worker_T>>({
//       influence_id: Date.now() % 10000,
//       worker_id: worker_id,
//       functionStr: new FunctionStr(Date.now() % 10000, "x", []),
//       set_attribute: (obj: worker_T, value: T) => obj,
//     });

//     const handleFunctionStrChange = (newFunctionStr: FunctionStr) => {
//       setEditedObject(prev => ({
//         ...prev,
//         functionStr: newFunctionStr,
//       }));
//     };

//     const popupProps: EditableObjectPopupProps<InfluenceAdvConstructor<T, worker_T>> = {
//       isOpen,
//       onClose,
//       object: editedObject,
//       set_object: setEditedObject,
//       onSave: (updatedObject: InfluenceAdvConstructor<T, worker_T>) => {
//         const newObj = new InfluenceAdv(updatedObject);
//         onSave(newObj);
//       },
//       title: "Create New Advanced Influence",
//       fields: [
//         {
//           key: "functionStr",
//           label: "Influence Function",
//           type: "custom",
//           render: (value: FunctionStr, onChange: (value: FunctionStr) => void) => (
//             <FunctionStrEditor value={value} onChange={handleFunctionStrChange} />
//           ),
//         },
//         {
//           key: "set_attribute",
//           label: "Set Attribute",
//           type: "custom",
//           render: (value: any, onChange: (value: any) => void) => (
//             <Select
//               value={value}
//               onValueChange={(newValue) => {
//                 const setter = atts[editedObject.worker_id]?.number[newValue]?.set_attribute;
//                 if (setter) {
//                   onChange(setter);
//                 }
//               }}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select attribute to set" />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.keys(atts[editedObject.worker_id]?.number || {}).map((attr) => (
//                   <SelectItem key={attr} value={attr}>
//                     {attr}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ),
//         },
//       ],
//     };

//     return <EditableObjectPopup {...popupProps} />;
//   }
// }