"use client";

import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Experience from "./visualexp";

export default function Home() {
  return (
      <div className="border-solid border-2 border-sky-500 ..." style={{ width: "40vw", height: "40vh" }}>
        <Experience />
      </div>
  );
};

