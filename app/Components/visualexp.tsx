"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Showobj } from "./three/Showobj";
import { useStore, getObjectsSelector, getPlacementListSelector, getZoomSelector, getIsVideoPlayingSelector, getIsVideoEndedSelector } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { PlacementControl } from "./three/PlacementControl";
import coloredObj from "@/classes/vizobjects/coloredObj";

export default function Experience() {
  const objectlist = useStore(getObjectsSelector);
  const placement = useStore(getPlacementListSelector);
  const zoom = useStore(getZoomSelector);
  const isVideoEnded= useStore(getIsVideoEndedSelector);
  const isVideoPlaying = useStore(getIsVideoPlayingSelector);

  return (
    <AnimatePresence>
      {isVideoEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={isVideoPlaying ? { delay: 2 } : { duration: 0 }}
          className="absolute inset-0 z-10"
        >
          <Canvas>
            <OrthographicCamera
              makeDefault
              zoom={zoom}
              position={[0, 0, 20]}
              near={0.1}
              far={1000}
            />
            
            {placement.map((item, index) => (
              <PlacementControl
                key={index}
                placementIndex={item.id}
              />
            ))}

            {objectlist.map((obj, index) => (
              obj instanceof coloredObj ? (
                <Showobj key={index} obj={obj as coloredObj} />
              ) : null
            ))}
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
