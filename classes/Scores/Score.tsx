'use client'

import { obj } from "../vizobjects/obj";
import { objectScorer } from "./objectScorer";
import React, { useEffect, useState } from "react";
import { getObjectSelector2, useStore } from "@/app/store";
import Latex from "react-latex-next";



/*
  * This class is responsible for storing information about a score that is to be computed
  * the attributes of this class are: score_id, text, desc, 
  * obj_list: list of objects involed in the score computation
  * transformation: function that from the list of values of the objects, computes the score
  * to_string: takes the output of the transform and converts it into a string (this allows for the score to be displayed in the UI
*/

export function ShowScore({ score }: { score: Score<any> }) {
  const [scoreValue, setScoreValue] = useState(null); // stores the value of the score
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

interface ScoreConstructor<Score_T> {
  score_id: number;
  text: string;
  desc: string;
  obj_list: objectScorer<any>[];
  transformation: (vals: number[]) => Score_T;
  to_string?: (score: Score_T) => string;
}

export class Score<Score_T> {
  score_id: number;
  text: string;
  desc: string;
  obj_list: objectScorer<any>[]; // list of objects involved in the score computation
  transformation: (vals: number[]) => Score_T; // function that from the list of values of the objects, computes the score
  to_string: (score: Score_T) => string; // function that takes the output of the transform and converts it into a string


  constructor({
    text,
    score_id,
    obj_list,
    desc = "",
    transformation,
    to_string = (score) => score as string,
  }: ScoreConstructor<Score_T>) {
    this.text = text;
    this.to_string = to_string;
    this.score_id = score_id;
    this.transformation = transformation;
    this.obj_list = obj_list;
    this.desc = desc;
  }

  // method to compute the the score given the list of objects involved in the score computation
  computeValue(objs: obj[]): Score_T {
    const filteredObjs = objs.filter(
      (obj) => obj !== undefined && obj.isEnabled
    ); // remove any objects that are not enabled or undefined

    const vals = this.obj_list.map((obj, index) =>
      obj.get_attribute(objs[index])
    ); 
    return this.transformation(vals);
  }

  // method to compare this score with a target value given a comparison function
  validate(
    obj_list: obj[],
    comparer: (a: Score_T, b: Score_T) => number,
    target: Score_T,
    tolerance: number = 0.1
  ): boolean {
    return Math.abs(comparer(this.computeValue(obj_list), target)) < tolerance;
  }

  dataBaseSave(): ScoreConstructor<Score_T> & {type: string} {
    return {
      score_id: this.score_id,
      text: this.text,
      desc: this.desc,
      obj_list: this.obj_list,
      transformation: this.transformation,
      to_string: this.to_string,
      type: 'Score'
    };
  }

  render(): React.ReactNode {
    return <ShowScore score={this} />;
  }
}
