import React, { useState, useContext, useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore, setVizObjSelector, DeleteVizObjSelector, getPlacementSelector, UpdateAllInfluencesSelector } from "@/app/store";
import {
  Selection,
  Select,
  EffectComposer,
  DotScreen,
  HueSaturation,
  Bloom,
} from "@react-three/postprocessing";
import { geomobj } from "@/classes/geomobj";

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

// Define the context type
type PlacementContextType = {
  isPlacementMode: boolean;
  setIsPlacementMode: React.Dispatch<React.SetStateAction<boolean>>;
  remainingPlacements: number;
  setRemainingPlacements: React.Dispatch<React.SetStateAction<number>>;
  objectsOnScene: number
  setObjectOnScene: React.Dispatch<React.SetStateAction<number>>
  showResetButton: boolean;
  setShowResetButton: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [remainingPlacements, setRemainingPlacements] = useState(length);
  const [objectsOnScene, setObjectOnScene] = useState(0)
  const [showResetButton, setShowResetButton] = useState(false);
  const placement = useStore(getPlacementSelector)
  const deleteObject = useStore(DeleteVizObjSelector)
  const updateAllInfluences = useStore(UpdateAllInfluencesSelector)


  const resetPlacements = () => {
    setRemainingPlacements(length);
    setObjectOnScene(0);
    setShowResetButton(false);
    placement?.object_ids.forEach((id) => { deleteObject(id) })
    
        
    };

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

export const usePlacementMode = () => useContext(PlacementContext);

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
  GridVectors = [],
  gridSize = [20, 20],
  cellSize = 5,
  obj_ids = [],
  geom = new THREE.PlaneGeometry(4, 4),
  color = "blue"
}: Partial<PlacementControlProps>) => {
  const {
    isPlacementMode,
    setIsPlacementMode,
    remainingPlacements,
    setRemainingPlacements,
    objectsOnScene,
    setObjectOnScene,
    setShowResetButton
  } = usePlacementMode();
  const [placementPositions, setPlacementPositions] = useState<THREE.Vector2[]>(
    []
  );
  const addObject = useStore(setVizObjSelector);
  const deleteObject = useStore(DeleteVizObjSelector)
  const updateAllInfluences = useStore(UpdateAllInfluencesSelector);

  const createPlacementPositions = () => {
    const positions: THREE.Vector2[] = [];
    GridVectors.forEach(element => {
        positions.push(element);
    });
    for (let x = 0; x <= gridSize[0]; x += cellSize) {
      for (let y = 0; y <= gridSize[1]; y += cellSize) {
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
        setShowResetButton(true); 
      const obj_id = obj_ids[obj_ids.length - remainingPlacements];
      if(!deleteObject(obj_id)) {
        setObjectOnScene(o => o + 1)
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
      // console.log(obj_id, " placed at ", position.x, position.y, remainingPlacements)
      updateAllInfluences()
      const newRemainingPlacements = remainingPlacements - 1;
      setRemainingPlacements(newRemainingPlacements);

      if (newRemainingPlacements === 0) {
        setIsPlacementMode(false);
      }
    }
  };

  React.useEffect(() => {
    if (isPlacementMode) {
      setRemainingPlacements(obj_ids.length);
      createPlacementPositions();
    } else {
      // setRemainingPlacements(0);
      // setPlacementPositions([]);
    }
  }, [isPlacementMode]);

  return (
    <>
      {isPlacementMode && (
        <>
          {/* <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.1} intensity={0.2} />
            
          </EffectComposer> */}
          
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

// New component for the placement activation button

export const PlacementActivationButton = ({
    totalPlacements,
    isActive
  }: {
    totalPlacements?: number;
    isActive: boolean
  }) => {
    const {
      isPlacementMode,
      setIsPlacementMode,
      objectsOnScene,
    } = usePlacementMode();
  
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
        <ResetButton />
      </div>
    );
  };
  
  export const ResetButton = () => {
    const { showResetButton, resetPlacements } = usePlacementMode();
  
    if (!showResetButton) return null;
  
    return (
      <button
        onClick={resetPlacements}
        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>
    );
  };
