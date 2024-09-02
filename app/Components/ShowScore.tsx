import React, { useEffect, useState } from "react";
import { useStore, getScore, getObjectSelector2 } from "../store";
import Latex from "react-latex-next";


// render the score box on the sidebar 
// this component is updated based if the vizobject that this depends on are updated

export default function ShowScore({
  score_id,
}: {
  score_id: number;
}) {
  const [scoreValue, setScoreValue] = useState(null); // stores the value of the score
  const score = getScore(score_id);
  const get_obj = useStore(getObjectSelector2);
  

  useEffect(() => { // update the score value using all the objects that this score depends on
    if(score) {
    const objs = score.obj_list.map((obj) => get_obj(obj.id));
    setScoreValue(score.computeValue(objs));
    }
  }, [get_obj]);

  return (
    score ?
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-2"> <Latex> {score.text}</Latex></h3>
      <p className=" text-gray-600 mb-2"> <Latex> {score.desc}</Latex> </p>
      <div className="flex items-center justify-between">
        <span className="text-gray-600"> </span>
        <span className="text-2xl font-bold text-blue-600">
          {scoreValue !== null ? (
            score.to_string(scoreValue)
          ) : (
            <span className="text-gray-400 text-lg">Calculating...</span>
          )}
        </span>
      </div>
      {scoreValue !== null && (
        <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, parseFloat(scoreValue)/1)}%` }} // set the width of the bar based on the score value
          ></div>
        </div>
      )}
    </div> : null
  );
}
