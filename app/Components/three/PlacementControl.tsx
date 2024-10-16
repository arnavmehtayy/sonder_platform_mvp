'use client'

import React, { useState, useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useStore,
  setVizObjSelector,
  DeleteVizObjSelector,
  UpdateAllInfluencesSelector,
  getPlacementSelector,
  isPlacementModeActive2,
  setIsPlacementModeActive2,
  getNumObjectsPlaced,
  setNumObjectsPlaced,
  getPlacementSelector2,
} from "@/app/store";
import { geomobj } from "@/classes/vizobjects/geomobj";
import Placement from "@/classes/Placement";

const PlacementMarker = ({
  position,
  onClick,
}: {
  position: THREE.Vector2;
  onClick: () => void;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(
        1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5
      );
    }
  });

  return (
    <group ref={ref} position={[position.x, position.y, 0]}>
      <mesh onClick={onClick}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="cyan" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.3, 0.03, 16, 100]} />
        <meshBasicMaterial color="cyan" />
      </mesh>
    </group>
  );
};

export const PlacementControl = ({
  placementIndex,
}: {
  placementIndex: number;
}) => {
  const isActivePlacement = useStore(isPlacementModeActive2)(placementIndex);
  const setIsPlacementMode = useStore(setIsPlacementModeActive2);
  const placement = useStore(getPlacementSelector(placementIndex));
  const [placementPositions, setPlacementPositions] = useState<THREE.Vector2[]>([]);
  const addObject = useStore(setVizObjSelector);
  const deleteObject = useStore(DeleteVizObjSelector);
  const updateAllInfluences = useStore(UpdateAllInfluencesSelector);
  const getNumObjs = useStore(getNumObjectsPlaced)(placementIndex)
  const setNumObjs = useStore(setNumObjectsPlaced)

  const createPlacementPositions = () => {
    const positions: THREE.Vector2[] = [...placement.gridVectors];
    if (placement.grid[0] !== 0 && placement.grid[1] !== 0) {
      for (let x = 0; x < placement.grid[0]; x += placement.cellSize) {
        for (let y = 0; y < placement.grid[1]; y += placement.cellSize) {
          positions.push(new THREE.Vector2(x - placement.grid[0] / 2, y - placement.grid[1] / 2));
        }
      }
    }
    setPlacementPositions(positions);
  };

  const handlePlacement = (position: THREE.Vector2) => {
    if (placement.max_placements - placement.numObjectsPlaced > 0) {
      const obj_id = placement.object_ids[
        placement.object_ids.length - (placement.max_placements - placement.numObjectsPlaced)
      ];
      if (!deleteObject(obj_id)) {
        setNumObjs(placementIndex, placement.numObjectsPlaced - 1);
      }
      addObject(
        obj_id,
        new geomobj({
          name: "added_obj",
          id: obj_id,
          position: position,
          geom: placement.geometry,
          geom_json: {type:'circle', params: {radius: 0.2}},
          color: placement.color,
        })
      );

      updateAllInfluences();
      const newNumObjs = placement.numObjectsPlaced + 1;
      setNumObjs(placementIndex, newNumObjs);

      if (newNumObjs >= placement.max_placements) {
        setIsPlacementMode(placementIndex, false);
      }
    }
  };

  React.useEffect(() => {
    if (isActivePlacement) {
      createPlacementPositions();
    }
  }, [isActivePlacement]);

  return (
    <>
      {isActivePlacement && (
        <>
          {placementPositions.map((position, index) => (
            <PlacementMarker
              key={index}
              position={position}
              onClick={() => handlePlacement(position)}
            />
          ))}
        </>
      )}
    </>
  );
};

export const PlacementActivationButton = ({
  isActive, 
  placement_id
}: {
  isActive: boolean;
  placement_id: number;
}) => {
  const isPlacementModeActive = useStore(isPlacementModeActive2)(placement_id);
  const setIsPlacementModeActive = useStore(setIsPlacementModeActive2);
  const getNumObjs = useStore(getNumObjectsPlaced)(placement_id)
  const setNumObjs = useStore(setNumObjectsPlaced)

  const totalPlacements = useStore(state => state.placement[placement_id]).max_placements;

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {getNumObjs}/{totalPlacements} placed
        </span>
        <button
          onClick={() => setIsPlacementModeActive(placement_id, !isPlacementModeActive)}
          disabled={!isActive || getNumObjs >= totalPlacements}
          className={`
            ${isPlacementModeActive ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"}
            ${(!isActive || getNumObjs >= totalPlacements) && "opacity-50 cursor-not-allowed"}
            text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
            flex items-center
          `}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPlacementModeActive ? "bg-green-400" : "bg-red-400"
            } mr-2`}
          ></span>
          {isPlacementModeActive ? "Active" : "Inactive"}
        </button>
      </div>
      <ResetButton isActive={isActive} placement_id={placement_id}/>
    </div>
  );
};

export const ResetButton = ({ isActive, placement_id}: { isActive: boolean, placement_id: number }) => {
  const placement = useStore(getPlacementSelector2)(placement_id)
  const setplacementState = useStore(setIsPlacementModeActive2)
  const setNumPlacedObjs = useStore(setNumObjectsPlaced)
  const deleteObject = useStore(DeleteVizObjSelector)
  const reset =() => {
    placement.object_ids.forEach((id: number) => {
              deleteObject(id);
            });
    setplacementState(placement_id, false);
    setNumPlacedObjs(placement_id, 0)
  }

  if (placement.numObjectsPlaced === 0) return null;

  return (
    <button
      disabled={!isActive}
      onClick={reset}
      className={`
        ${!isActive && "opacity-50 cursor-not-allowed"}
        bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm font-medium
        transition duration-300 ease-in-out flex items-center
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Reset
    </button>
  );
};