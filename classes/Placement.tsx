import * as THREE from "three";
import { useStore, getPlacementSelector } from "@/app/store";
import { PlacementActivationButton } from "@/app/Components/three/PlacementControl";

/*
 * This class stores information about a control that allows users to place of objects on the three.js experience
 * the attributes of this class are:
 * object_ids: the ids of the objects that can be placed
 * grid: the grid that the objects can be placed on
 * cellSize: the size of the cell in the grid
 * geometry: the geometry of the object that is to be placed
 * gridVectors: the vectors of the grid
 * color: the color of the placement
 * desc: the description of the placement in the sidebar
 * text
 * isClickable: whether the placement is activable or not with the isActive button
 * NOTE: if we set the grid to [0,0] then the options to place in come solely from the gridVectors
 */

function ShowPlacement({id}: {id: number}) {
  const placement = useStore(getPlacementSelector(id));

  const isActive = placement?.isClickable || false;
  
  if (placement) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${!isActive&& 'opacity-50'}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">{placement.desc}</h3>
            <p className="text-gray-600 mb-2">{placement.text}</p>
          </div>
          <PlacementActivationButton isActive={isActive} placement_id={id}/>
        </div>
      </div>
    );
  }
  return null;
}

interface PlacementConstructor {
  id: number;
  object_ids: number[];
  grid?: [number, number];
  cellSize?: number;
  geometry?: THREE.BufferGeometry;
  gridVectors?: THREE.Vector2[];
  text?: string;
  desc?: string;
  color?: string;
  isClickable?: boolean;
  max_placements?: number;
}

export default class Placement {
  id: number
  object_ids: number[]; // the ids of the objects that can be placed
  grid: [number, number]; // the grid that the objects can be placed on
  cellSize: number; // the size of the cell in the grid
  geometry: THREE.BufferGeometry; // the geometry of the object that is to be placed
  gridVectors: THREE.Vector2[]; // the positions that the object can be placed on in the grid
  text: string;
  color: string;
  desc: string;
  isClickable: boolean; // whether the placement is activable or not with the isActive button
  max_placements: number;
  isPlacementActive: boolean = false;
  numObjectsPlaced: number = 0;

  constructor({
    id,
    object_ids,
    grid = [0, 0],
    cellSize = 0,
    geometry = new THREE.PlaneGeometry(4, 4),
    gridVectors = [],
    text = "Click to place objects",
    desc = "placement",
    color = "blue",
    max_placements = 1,
    isClickable = true,
  }: PlacementConstructor) {
    this.desc = desc;
    this.object_ids = object_ids;
    this.grid = grid;
    this.cellSize = cellSize;
    this.geometry = geometry;
    this.gridVectors = gridVectors;
    this.text = text;
    this.color = color;
    this.isClickable = isClickable;
    this.id = id
    this.max_placements = max_placements;
  }

  // make this object clickable used by the storage system
  static setPlacementisClickable(
    obj: Placement,
    isClickable: boolean
  ): Placement {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    newObj.isClickable = isClickable;
    return newObj;
  }

  static setPlacementActive( obj: Placement, isActive: boolean): Placement {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    newObj.isPlacementActive = isActive;
    return newObj;
  }

  static setNumObjectsPlaced(obj: Placement, num: number): Placement {
    const newObj = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    newObj.numObjectsPlaced = num
    return newObj;
  }

  dataBaseSave(): PlacementConstructor & {type: string} {
    return {
      id: this.id,
      object_ids: this.object_ids,
      grid: this.grid,
      cellSize: this.cellSize,
      geometry: this.geometry,
      gridVectors: this.gridVectors,
      text: this.text,
      desc: this.desc,
      color: this.color,
      isClickable: this.isClickable,
      max_placements: this.max_placements,
      type: "Placement"
    };
  }

  render() {
    return <ShowPlacement id={this.id} />;
  }
}
