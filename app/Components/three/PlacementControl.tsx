import React, { useState, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, setVizObjSelector } from '@/app/store';
import { geomobj } from '@/classes/geomobj';

// Define the context type
interface PlacementContextType {
  isPlacementMode: boolean;
  setIsPlacementMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with an initial value
const PlacementContext = React.createContext<PlacementContextType>({
  isPlacementMode: false,
  setIsPlacementMode: () => {},
});

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  return (
    <PlacementContext.Provider value={{ isPlacementMode, setIsPlacementMode }}>
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacementMode = () => useContext(PlacementContext);

interface PlacementControlProps {
  gridSize?: [number, number];
  cellSize?: number;
}

export const PlacementControl: React.FC<PlacementControlProps> = ({ 
  gridSize = [10, 10], 
  cellSize = 1 
}) => {
  const { isPlacementMode, setIsPlacementMode } = usePlacementMode();
  const [placementPositions, setPlacementPositions] = useState<THREE.Vector3[]>([]);
  const addObject = useStore(setVizObjSelector);
  const { scene } = useThree();

  const createPlacementPositions = () => {
    const positions: THREE.Vector3[] = [];
    for (let x = 0; x <= gridSize[0]; x += cellSize) {
      for (let y = 0; y <= gridSize[1]; y += cellSize) {
        positions.push(new THREE.Vector3(x - gridSize[0]/2, y - gridSize[1]/2, 0));
      }
    }
    setPlacementPositions(positions);
  };

  const handlePlacement = (position: THREE.Vector3) => {
    addObject(
      999, // Generate a unique ID
      new geomobj({id: 999, position: new THREE.Vector2(position.x, position.y), geom: new THREE.CircleGeometry(4, 128), color: 'blue'}),
    );
    setIsPlacementMode(false);
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
      {isPlacementMode && placementPositions.map((position, index) => (
        <mesh
          key={index}
          position={position}
          onClick={() => handlePlacement(position)}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
    </>
  );
};

// New component for the placement activation button
export const PlacementActivationButton: React.FC = () => {
  const { isPlacementMode, setIsPlacementMode } = usePlacementMode();

  return (
    <button 
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: isPlacementMode ? '#ff4444' : '#44ff44',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
      onClick={() => setIsPlacementMode(!isPlacementMode)}
    >
      {isPlacementMode ? 'Cancel Placement' : 'Activate Placement'}
    </button>
  );
};