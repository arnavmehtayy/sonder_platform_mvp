import React from 'react';
import { useStore, getSideBarName, getValidationDescription, getAdvancedInfluencesSelector, deleteValidationByIndexSelect } from "@/app/store";
import { Trash2 } from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';

interface SceneManagerProps {
  sensors: any;
  handleDragEnd: (event: any) => void;
  handleDeleteItem: (id: number, type: string) => void;
}

export function SceneManager({ sensors, handleDragEnd, handleDeleteItem }: SceneManagerProps) {
  const order = useStore((state) => state.order);
  const vizobjs = useStore((state) => state.vizobjs);
  const validationInstance = useStore((state) => state.validations);
  const getName = useStore(getSideBarName);
  const validationDescriptions = useStore(getValidationDescription);
  const validationDeletor = useStore(deleteValidationByIndexSelect);
  const advancedInfluences = useStore(getAdvancedInfluencesSelector);
  const deleteInfluenceAdv = useStore((state) => state.deleteInfluenceAdv);
  const deleteVizObj = useStore((state) => state.deleteVizObj);

  return (
    <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Scene Manager</DialogTitle>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mt-4">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={order.map(item => `${item.type}-${item.id}`)} 
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {order.map((item) => (
                  <SortableItem 
                    key={`${item.type}-${item.id}`} 
                    id={`${item.type}-${item.id}`}
                  >
                    <div className="flex-grow">{getName(item)}</div>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.type)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Visual Objects Manager</h3>
          <ul className="space-y-2">
            {Object.entries(vizobjs).map(([id, obj]) => (
              <li key={id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{`${obj.name}`}</span>
                <button
                  onClick={() => deleteVizObj(Number(id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Influences Manager</h3>
          <ul className="space-y-2">
            {Object.entries(advancedInfluences).flatMap(([depId, influences]) =>
              influences.map((influence) => (
                <li
                  key={`adv-inf-${influence.influence_id}`}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span>{`Influence ${influence.influence_id}: ${influence.worker_id} ← [${influence.dependencyIds.join(', ')}]`}</span>
                  <button
                    onClick={() => deleteInfluenceAdv(influence.influence_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mt-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Validation Manager</h3>
          <ul className="space-y-2">
            {validationInstance.map((validation, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span>{validationDescriptions(validation)}</span>
                <button
                  onClick={() => validationDeletor(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DialogContent>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center bg-gray-100 p-2 rounded">
      <div {...attributes} {...listeners} className="cursor-move mr-2">
        <GripVertical size={20} />
      </div>
      {children}
    </li>
  );
}