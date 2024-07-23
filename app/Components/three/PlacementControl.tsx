import React, { useState, useContext, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, setVizObjSelector} from '@/app/store';
import { Selection, Select, EffectComposer, DotScreen, HueSaturation, Bloom } from '@react-three/postprocessing';
import { geomobj } from '@/classes/geomobj';


const PlacementMarker = ({ position, onClick } : {position: THREE.Vector3, onClick: () => void}) => {
    const ref = useRef<THREE.Group>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5);
      }
    });
  
    return (
      <group ref={ref} position={position}>
        <mesh onClick={onClick}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="cyan" transparent opacity={0.2} />
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
}

// Create the context with an initial value
const PlacementContext = React.createContext<PlacementContextType>({
  isPlacementMode: false,
  setIsPlacementMode: () => {},
});

export const PlacementProvider = ({ children } : {children: React.ReactNode}) => {
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  return (
    <PlacementContext.Provider value={{ isPlacementMode, setIsPlacementMode }}>
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacementMode = () => useContext(PlacementContext);

type PlacementControlProps = {
  GridVectors?: THREE.Vector3[];
  gridSize?: [number, number];
  cellSize?: number;
  obj_id: number;
  geom: THREE.BufferGeometry;
}

export const PlacementControl = ({ 
  GridVectors = [],
  gridSize = [20, 20], 
  cellSize = 5,
  obj_id = 999,
  geom = new THREE.PlaneGeometry(4, 4),

} : Partial<PlacementControlProps>)   => {
  const { isPlacementMode, setIsPlacementMode } = usePlacementMode();
  const [placementPositions, setPlacementPositions] = useState<THREE.Vector3[]>([]);
  const addObject = useStore(setVizObjSelector);
  const { scene } = useThree();

  const createPlacementPositions = () => {
    const positions: THREE.Vector3[] = GridVectors;
    for (let x = 0; x <= gridSize[0]; x += cellSize) {
      for (let y = 0; y <= gridSize[1]; y += cellSize) {
        positions.push(new THREE.Vector3(x - gridSize[0]/2, y - gridSize[1]/2, 0));
        // console.log("Position: ", positions[positions.length - 1])
      }
    }
    setPlacementPositions(positions);
  };

  const handlePlacement = (position: THREE.Vector3, obj_id: number, geom: THREE.BufferGeometry) => {
    addObject(
      obj_id, // Generate a unique ID
      new geomobj({id: obj_id, position: new THREE.Vector2(position.x, position.y), geom: geom, color: 'blue'}),
    );
    setIsPlacementMode(false); // turn the button off after the object has been placed
  };
  

  React.useEffect(() => {
    if (isPlacementMode) {
      createPlacementPositions();
    } else {
      setPlacementPositions([]);
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
              onClick={() => handlePlacement(position, obj_id, geom)}
            />
          ))}
        </>
      )}
    </>
  );
};

// New component for the placement activation button
export const PlacementActivationButton: React.FC = () => {
  const { isPlacementMode, setIsPlacementMode } = usePlacementMode();

  return (
    <button 
    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center text-sm md:text-base"
      onClick={() => setIsPlacementMode(!isPlacementMode)}
    >
      {isPlacementMode ? 'Cancel Placement' : 'Activate Placement'}
    </button>
  );
};