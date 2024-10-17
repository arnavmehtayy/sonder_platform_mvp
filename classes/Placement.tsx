import * as THREE from "three";
import { useStore, getPlacementSelector } from "@/app/store";
import { PlacementActivationButton } from "@/app/Components/three/PlacementControl";
import { PredefinedGeometry } from "./vizobjects/geomobj";
import React from "react";
import { EditableObjectPopupProps, EditableObjectPopup } from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vector2 } from 'three';
import { X } from "lucide-react";

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

export interface PlacementConstructor {
  id: number;
  object_ids: number[];
  grid?: [number, number];
  cellSize?: number;
  geometry?: THREE.BufferGeometry;
  geometry_json?: PredefinedGeometry;
  gridVectors?: THREE.Vector2[];
  text?: string;
  desc?: string;
  color?: string;
  isClickable?: boolean;
  max_placements?: number;
  type?: placement_type
}

export type placement_type = "Placement"

export default class Placement {
  id: number
  object_ids: number[]; // the ids of the objects that can be placed
  grid: [number, number]; // the grid that the objects can be placed on
  cellSize: number; // the size of the cell in the grid
  geometry: THREE.BufferGeometry; // the geometry of the object that is to be placed
  geom_json: PredefinedGeometry;
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
    geometry_json, // = {type: 'circle', params: {radius: 0.5}},
    gridVectors = [],
    text = "Click to place objects",
    desc = "placement",
    color = "#0000FF",
    max_placements = 1,
    isClickable = true,
    
  }: PlacementConstructor) {
    this.desc = desc;
    this.object_ids = object_ids;
    this.grid = grid;
    this.cellSize = cellSize;
    this.gridVectors = gridVectors;
    this.text = text;
    this.color = color;
    this.isClickable = isClickable;
    this.id = id
    this.max_placements = max_placements;
    this.geometry = geometry_json ? this.createPredefinedGeometry(geometry_json): geometry;
    this.geom_json = {type: 'circle', params: {radius: 0.5}}
  }

  private createPredefinedGeometry(geomDef: PredefinedGeometry): THREE.BufferGeometry {
    switch (geomDef.type) {
      case 'circle':
        return new THREE.CircleGeometry(geomDef.params.radius || 1, 32);
      case 'rectangle':
        return new THREE.PlaneGeometry(geomDef.params.width || 1, geomDef.params.height || 1);
      case 'triangle':
        const triangleShape = new THREE.Shape();
        const sideLength = geomDef.params.sideLength || 1;
        triangleShape.moveTo(0, 0);
        triangleShape.lineTo(sideLength, 0);
        triangleShape.lineTo(sideLength / 2, sideLength * Math.sqrt(3) / 2);
        triangleShape.lineTo(0, 0);
        return new THREE.ShapeGeometry(triangleShape);
      case 'regular-polygon':
        const numSides = geomDef.params.numSides || 5;
        const radius = geomDef.params.radius || 1;
        return new THREE.CircleGeometry(radius, numSides);
      default:
        return new THREE.CircleGeometry(1, 32);
    }
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

  dataBaseSave(): PlacementConstructor  {
    return {
      id: this.id,
      object_ids: this.object_ids,
      grid: this.grid,
      cellSize: this.cellSize,
      geometry_json: this.geom_json,
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

  static getPopup({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newObject: Placement) => void;
  }): React.ReactElement {
    const [editedObject, setEditedObject] = React.useState<PlacementConstructor>({
      id: Date.now() % 10000,
      object_ids: [],
      grid: [0, 0],
      cellSize: 1,
      geometry_json: { type: 'circle', params: { radius: 0.5 } },
      gridVectors: [],
      text: "Click to place objects",
      desc: "New Placement",
      color: "#0000FF",
      isClickable: true,
      max_placements: 1,
    });
  
    const popupProps: EditableObjectPopupProps<PlacementConstructor> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: PlacementConstructor) => {
        const newObj = new Placement({
          ...updatedObject,
          object_ids: Array.from({ length: updatedObject.max_placements || 0 }, () => Math.floor(Math.random() * 10000))
        });
        onSave(newObj);
      },
      title: `Create New Placement`,
      fields: [
        { key: "desc", label: "Title", type: "title" },
        { key: "text", label: "Description Text", type: "textarea" },
        // { key: "grid", label: "Grid", type: "arraynum", length_of_array: 2 },
        // { key: "cellSize", label: "Cell Size", type: "number" },
        {key: "geometry_json",
          label: "Geometry",
          type: "geometry"
        },
        // {
        //   key: "geometry_json",
        //   label: "Geometry",
        //   type: "select",
        //   options: [
        //     { label: "Circle", value: { type: "circle", params: { radius: 0.5 } } },
        //     { label: "Rectangle", value: { type: "rectangle", params: { width: 1, height: 1 } } },
        //     { label: "Triangle", value: { type: "triangle", params: { sideLength: 1 } } },
        //     { label: "Regular Polygon", value: { type: "regular-polygon", params: { radius: 1, numSides: 5 } } },
        //   ],
        // },
        { key: "gridVectors", label: "Grid Vectors", type: "custom", render: (value, onChange) => (
          <GridVectorsInput value={value} onChange={onChange} />
        )},
        { key: "color", label: "Color", type: "color" },
        { key: "max_placements", label: "Max Placements", type: "number" },
      ],
    };
  
    return <EditableObjectPopup {...popupProps} />;
  }
}


    // Start of Selection
    interface GridVectorsInputProps {
      value: any[];
      onChange: (newValue: any[]) => void;
    }
    
    function GridVectorsInput({ value, onChange }: GridVectorsInputProps) {
      const handleAddVector = () => {
        onChange([...value, new Vector2(0, 0)]);
      };
    
      const handleRemoveVector = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
      };
    
      const handleVectorChange = (index: number, axis: 'x' | 'y', newValue: any) => {
        const newVectors = [...value];
        if (newValue === null) {
          newVectors[index][axis] = 0;
        } else {
          const numValue = parseFloat(newValue);
          newVectors[index][axis] = numValue;
        }
        onChange(newVectors);
      };
    
      return (
        <div>
          {value.map((vector, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                placeholder="X"
                type="text"
                // value={vector.x === 0 ? '' : vector.x.toString()}
                onChange={(e) => handleVectorChange(index, 'x', e.target.value === '' ? null : e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value;
                  handleVectorChange(index, 'x', value === '' ? null : value);
                }}
                onWheel={(e) => e.currentTarget.blur()}
                className="mr-2"
              />
              <Input
                placeholder="Y"
                type="text"
                //value={vector.y === 0 ? '' : vector.y.toString()}
                onChange={(e) => handleVectorChange(index, 'y', e.target.value === '' ? null : e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value;
                  handleVectorChange(index, 'y', value === '' ? null : value);
                }}
                onWheel={(e) => e.currentTarget.blur()}
                className="mr-2"
              />
              <Button
                onClick={() => handleRemoveVector(index)}
                variant="ghost"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex space-x-2 mt-2">
            <Button onClick={handleAddVector} variant="outline" size="sm">
              Add Vector
            </Button>
          </div>
        </div>
      );
    }

