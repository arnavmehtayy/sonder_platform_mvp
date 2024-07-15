"use client";
import { Influence } from "@/classes/influence";
import {
  useStore,
  getInfluenceSelector,
  setVizObjSelector,
  getObjectSelector,
} from "../store";

// export default function InfluenceManage({ master_id }: { master_id: number }) {
  
//   const influence = useStore(getInfluenceSelector(master_id));
//   if(!influence) {
//     return null
//   }
//   const setObj = useStore(setVizObjSelector);
//   const master = useStore(getObjectSelector(master_id));
//   const worker = useStore(getObjectSelector(influence.worker_id))
//   Influence.UpdateInfluence(
//     influence,
//     setObj,
//     master,
//     worker
//   );
//   return null
// }
