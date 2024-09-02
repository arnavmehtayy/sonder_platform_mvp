import React, { useState, useContext, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useStore,
  setVizObjSelector,
  DeleteVizObjSelector,
  getPlacementSelector,
  UpdateAllInfluencesSelector,
  isPlacementModeSelector,
  setIsPlacementModeSelector,
} from "@/app/store";
import { geomobj } from "@/classes/vizobjects/geomobj";

/*
 * This component is responsible for the placement of objects in the scene.
 * It is used to place objects in the scene by clicking on a set of available position.
 * the clickable positions are denoted with a circle that is scaled up and down.
 * The user can reset the placements using the reset button.
 * The user can activate or deactivate the placement mode using the activation button.
 */

// marks positions where objects can be placed on the three js canvas
const PlacementMarker = ({
  position,
  onClick,
}: {
  position: THREE.Vector2;
  onClick: () => void;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    // animation to denote the clickable positions
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

// Define the context type
type PlacementContextType = {
  // get and set if the placement is active
  isPlacementMode: boolean;
  setIsPlacementMode: (val: boolean) => void;

  // get and set the number of remaining placements
  remainingPlacements: number;
  setRemainingPlacements: React.Dispatch<React.SetStateAction<number>>;

  // get and set the number of objects on the scene
  objectsOnScene: number;
  setObjectOnScene: React.Dispatch<React.SetStateAction<number>>;

  // the reset button state and function to do so
  showResetButton: boolean;
  setShowResetButton: React.Dispatch<React.SetStateAction<boolean>>;

  // reset all the objects that were placed
  resetPlacements: () => void;
};

// Create the context with an initial value
const PlacementContext = React.createContext<PlacementContextType>({
  isPlacementMode: false,
  setIsPlacementMode: () => {},
  remainingPlacements: 0,
  setRemainingPlacements: () => {},
  objectsOnScene: 0,
  setObjectOnScene: () => {},
  showResetButton: false,
  setShowResetButton: () => {},
  resetPlacements: () => {},
});

export const PlacementProvider = ({
  length,
  children,
}: {
  children: React.ReactNode;
  length: number;
}) => {
  // create all the state variables and functions
  const isPlacementMode = useStore(isPlacementModeSelector);
  const setIsPlacementMode = useStore(setIsPlacementModeSelector);
  const [remainingPlacements, setRemainingPlacements] = useState(length);
  const [objectsOnScene, setObjectOnScene] = useState(0);
  const [showResetButton, setShowResetButton] = useState(false);
  const placement = useStore(getPlacementSelector);
  const deleteObject = useStore(DeleteVizObjSelector);

  const resetPlacements = () => {
    setRemainingPlacements(length);
    setObjectOnScene(0);
    setShowResetButton(false);
    placement?.object_ids.forEach((id) => {
      deleteObject(id);
    });
  };

  // create the context with the above values
  return (
    <PlacementContext.Provider
      value={{
        isPlacementMode,
        setIsPlacementMode,
        remainingPlacements,
        setRemainingPlacements,
        objectsOnScene,
        setObjectOnScene,
        showResetButton,
        setShowResetButton,
        resetPlacements,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacementMode = () => useContext(PlacementContext); // shorthand for using the context

type PlacementControlProps = {
  GridVectors?: THREE.Vector2[];
  gridSize?: [number, number];
  cellSize?: number;
  obj_ids: number[];
  geom: THREE.BufferGeometry;
  onPlacement: (remainingPlacements: number) => void;
  color: string;
};

export const PlacementControl = ({
  GridVectors = [], // user defied positions where objects can be placed
  gridSize = [20, 20], // size of the grid where objects can be placed
  cellSize = 5, // size of the cell in the grid
  obj_ids = [], // the ids of the objects that can be placed
  geom = new THREE.PlaneGeometry(4, 4), // the geometry of the object that are to be placed
  color = "blue",
}: Partial<PlacementControlProps>) => {
  const {
    isPlacementMode,
    setIsPlacementMode,
    remainingPlacements,
    setRemainingPlacements,
    objectsOnScene,
    setObjectOnScene,
    setShowResetButton,
  } = usePlacementMode();
  const [placementPositions, setPlacementPositions] = useState<THREE.Vector2[]>(
    []
  );
  const addObject = useStore(setVizObjSelector);
  const deleteObject = useStore(DeleteVizObjSelector);
  const updateAllInfluences = useStore(UpdateAllInfluencesSelector);

  const createPlacementPositions = () => {
    const positions: THREE.Vector2[] = [];
    GridVectors.forEach((element) => {
      positions.push(element);
    });
    for (let x = 0; x < gridSize[0]; x += cellSize) {
      for (let y = 0; y < gridSize[1]; y += cellSize) {
        positions.push(
          new THREE.Vector2(x - gridSize[0] / 2, y - gridSize[1] / 2)
        );
        // console.log("Position: ", positions[positions.length - 1])
      }
    }
    setPlacementPositions(positions);
  };

  const handlePlacement = (position: THREE.Vector2) => {
    if (remainingPlacements > 0) {
      setShowResetButton(true); // show the reset button when the first object is placed
      const obj_id = obj_ids[obj_ids.length - remainingPlacements]; // get the id of the object to be placed
      if (!deleteObject(obj_id)) {
        // delete the object if it already exists and if not increment the number of objects on the scene
        setObjectOnScene((o) => o + 1);
      }
      addObject(
        obj_id,
        new geomobj({
          id: obj_id,
          position: position,
          geom: geom,
          color: color,
        })
      );

      updateAllInfluences();
      const newRemainingPlacements = remainingPlacements - 1;
      setRemainingPlacements(newRemainingPlacements);

      if (newRemainingPlacements === 0) {
        // if all the objects are placed then exit the placement mode
        setIsPlacementMode(false);
      }
    }
  };

  React.useEffect(() => {
    // create the placement positions when the placement mode is activated
    if (isPlacementMode) {
      setRemainingPlacements(obj_ids.length);
      createPlacementPositions();
    }
  }, [isPlacementMode]);

  return (
    <>
      {isPlacementMode && (
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

// component for the placement activation button
export const PlacementActivationButton = ({
  totalPlacements,
  isActive,
}: {
  totalPlacements?: number;
  isActive: boolean;
}) => {
  const { isPlacementMode, setIsPlacementMode, objectsOnScene } =
    usePlacementMode();

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {objectsOnScene}/{totalPlacements} placed
        </span>
        <button
          onClick={() => setIsPlacementMode(!isPlacementMode)}
          disabled={!isActive}
          className={`
                  ${
                    isPlacementMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 hover:bg-gray-500"
                  }
                  ${!isActive && "opacity-50 cursor-not-allowed"}
                  text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out
                  flex items-center
                `}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPlacementMode ? "bg-green-400" : "bg-red-400"
            } mr-2`}
          ></span>
          {isPlacementMode ? "Active" : "Inactive"}
        </button>
      </div>
      <ResetButton isActive={isActive} />
    </div>
  );
};

// component for the reset button to reset all the placements
export const ResetButton = ({ isActive }: { isActive: boolean }) => {
  const { showResetButton, resetPlacements } = usePlacementMode();

  if (!showResetButton) return null;

  return (
    <button
      disabled={!isActive}
      onClick={resetPlacements}
      className={` ${
        !isActive && "opacity-50 cursor-not-allowed"
      } bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center`}
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
