import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Minus, Check, X, Pencil } from "lucide-react";
import { DummyDataStorage } from "@/classes/vizobjects/DummyDataStore";
import { useStore } from "@/app/store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DummyDataManager() {
  const vizobjs = useStore((state) => state.vizobjs);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const setVizObj = useStore((state) => state.setVizObj);

  const [isMinimized, setIsMinimized] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVariable, setNewVariable] = useState({
    name: "",
    type: "number",
    value: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingVariable, setEditingVariable] = useState({
    name: "",
    type: "number",
    value: "",
  });

  // Filter for only DummyDataStorage objects
  const dummyDataObjects = Object.values(vizobjs).filter(
    (obj) => obj instanceof DummyDataStorage
  ) as DummyDataStorage<any>[];

  const handleCreateDummy = () => {
    if (!newVariable.name || !newVariable.value) return;

    let typedValue: any;
    switch (newVariable.type) {
      case "number":
        typedValue = Number(newVariable.value);
        break;
      case "string":
        typedValue = String(newVariable.value);
        break;
      case "boolean":
        typedValue = newVariable.value === "true";
        break;
    }

    const newDummy = new DummyDataStorage({
      id: Date.now() % 10000,
      name: newVariable.name,
      data: typedValue,
    });

    setVizObj(newDummy.id, newDummy);
    setNewVariable({ name: "", type: "number", value: "" });
    setShowCreateForm(false);
  };

  const handleStartEdit = (dummy: DummyDataStorage<any>) => {
    setEditingId(dummy.id);
    setEditingVariable({
      name: dummy.name,
      type: typeof dummy.data === "boolean" ? "boolean" : typeof dummy.data,
      value: String(dummy.data),
    });
  };

  const handleSaveEdit = (dummyId: number) => {
    if (!editingVariable.name || !editingVariable.value) return;

    let typedValue: any;
    switch (editingVariable.type) {
      case "number":
        typedValue = Number(editingVariable.value);
        break;
      case "string":
        typedValue = String(editingVariable.value);
        break;
      case "boolean":
        typedValue = editingVariable.value === "true";
        break;
    }

    // Delete old object and create new one with updated values
    deleteVizObj(dummyId);
    
    const updatedDummy = new DummyDataStorage({
      id: dummyId,
      name: editingVariable.name,
      data: typedValue,
    });

    setVizObj(dummyId, updatedDummy);
    setEditingId(null);
    setEditingVariable({ name: "", type: "number", value: "" });
  };

  return (
    <div className="absolute bottom-20 right-2 w-80 bg-white rounded-lg shadow-xl z-30">
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 h-6 w-6 p-0"
          >
            {isMinimized ? "▼" : "▲"}
          </Button>
          <h3 className="text-sm font-semibold text-gray-700">Variables</h3>
        </div>

        {!isMinimized && !showCreateForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 w-7 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isMinimized && (
        <div className="p-4">
          {/* Create new variable section */}
          {showCreateForm && (
            <>
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Name"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
                <Select
                  value={newVariable.type}
                  onValueChange={(value) => setNewVariable({ ...newVariable, type: value })}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 mb-4">
                {newVariable.type === "boolean" ? (
                  <Select
                    value={newVariable.value}
                    onValueChange={(value) => setNewVariable({ ...newVariable, value })}
                  >
                    <SelectTrigger className="flex-1 h-8">
                      <SelectValue placeholder="Value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Value"
                    value={newVariable.value}
                    onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                    type={newVariable.type === "number" ? "number" : "text"}
                    className="flex-1 h-8 text-sm"
                  />
                )}
                <Button
                  size="sm"
                  onClick={handleCreateDummy}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* List of existing variables */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {dummyDataObjects.map((dummy) => (
              <div key={dummy.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                {editingId === dummy.id ? (
                  // Edit mode
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Name"
                        value={editingVariable.name}
                        onChange={(e) => setEditingVariable({...editingVariable, name: e.target.value})}
                        className="h-8 text-sm flex-1"
                      />
                      <Select
                        value={editingVariable.type}
                        onValueChange={(value) => setEditingVariable({
                          ...editingVariable,
                          type: value,
                          value: "", // Reset value when type changes
                        })}
                      >
                        <SelectTrigger className="w-24 h-8">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      {editingVariable.type === "boolean" ? (
                        <Select
                          value={editingVariable.value}
                          onValueChange={(value) => setEditingVariable({...editingVariable, value})}
                        >
                          <SelectTrigger className="flex-1 h-8">
                            <SelectValue placeholder="Value" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder="Value"
                          value={editingVariable.value}
                          onChange={(e) => setEditingVariable({...editingVariable, value: e.target.value})}
                          type={editingVariable.type === "number" ? "number" : "text"}
                          className="flex-1 h-8 text-sm"
                        />
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(dummy.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">{dummy.name}</span>
                      <span className="text-xs text-gray-500">Value: {String(dummy.data)}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(dummy)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVizObj(dummy.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {dummyDataObjects.length === 0 && !showCreateForm && (
              <div className="text-center text-sm text-gray-500 py-2">
                No variables created
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 