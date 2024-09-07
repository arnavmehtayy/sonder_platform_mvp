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

  const score = getScore(score_id);
  return score.render();
}
