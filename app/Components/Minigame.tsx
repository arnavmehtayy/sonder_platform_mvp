"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Experience from "./visualexp";
import { vizobj } from "@/classes/vizobj";
import Link from "next/link";

export function Minigame({page}: {page: number}) {
  const [text, setText] = useState("This is a test question? ");
  let userTestStatus: vizobj[] = [
    new vizobj(new THREE.Vector2(-10, 2), new THREE.PlaneGeometry(4,4), "green"), 
    new vizobj(new THREE.Vector2(2,2), new THREE.PlaneGeometry(4,4), "red")
];
  return (
    <>
      <div
        className="border-solid border-2 border-blue-200 ..."
        style={{ width: "100vw", height: "80vh" }}
      >
        <Experience vizobjs = {userTestStatus} onClickCube={() => setText("It is correct")} />
      </div>
      <div className="bg-blue-200 shadow-lg rounded-lg p-6 m-4">
        <div className="text-gray-700 text-lg">
          <p id="question-text"> {text}</p>
        </div>
        <div className="flex justify-end mt-4">
          <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                href = {`/${(Number(page)+1)}`}>
            Next Question
          </Link>
        </div>
      </div>
    </>
  );
}
