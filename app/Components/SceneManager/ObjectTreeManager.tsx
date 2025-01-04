import React, { useState } from "react";
import { useStore } from "@/app/store";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Check,
  X,
  Pencil,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DummyDataStorage } from "@/classes/vizobjects/DummyDataStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ObjectTreeManager() {
  const vizobjs = useStore((state) => state.vizobjs);
  const deleteVizObj = useStore((state) => state.deleteVizObj);
  const setVizObj = useStore((state) => state.setVizObj);
  const setEditingObject = useStore((state) => state.setEditingObject);

  const [openSections, setOpenSections] = React.useState({
    objects: true,
    variables: true,
  });

  // Variables state
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
  const [editingObjects, setEditingObjects] = useState<{
    [key: number]: boolean;
  }>({});

  // Filter objects
  const sceneObjects = Object.entries(vizobjs).filter(
    ([_, obj]) => !(obj instanceof DummyDataStorage)
  );
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

  const handleToggleEdit = (objId: number) => {
    setEditingObjects((prev) => {
      const newState = {
        ...prev,
        [objId]: !prev[objId],
      };
      setEditingObject(objId, !prev[objId]);
      return newState;
    });
  };

  return (
    <div className="h-full bg-blue-50 border-r border-gray-200 overflow-hidden">
      <div className="p-4 h-full overflow-y-auto overflow-x-hidden">
        <h2 className="text-lg font-semibold mb-4">Scene Hierarchy</h2>

        {/* Objects Section */}
        <div className="mb-4 bg-white rounded-lg p-3 shadow-sm">
          <Collapsible
            open={openSections.objects}
            onOpenChange={(open) =>
              setOpenSections((prev) => ({ ...prev, objects: open }))
            }
            className="mb-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-between items-center mb-2"
              >
                <span className="font-medium">Scene Objects</span>
                {openSections.objects ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2">
                {sceneObjects.map(([id, obj]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        {obj.isEnabled ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="text-sm truncate">{obj.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleEdit(Number(id))}
                        className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 flex-shrink-0"
                      >
                        {editingObjects[Number(id)] ? (
                          <Save className="h-4 w-4" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVizObj(Number(id))}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Variables Section */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <Collapsible
            open={openSections.variables}
            onOpenChange={(open) =>
              setOpenSections((prev) => ({ ...prev, variables: open }))
            }
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex justify-between items-center mb-2"
              >
                <span className="font-medium">Variables</span>
                {openSections.variables ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2">
                {dummyDataObjects.map((dummy) => (
                  <div
                    key={dummy.id}
                    className="p-2 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100"
                  >
                    {editingId === dummy.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Name"
                          value={editingVariable.name}
                          onChange={(e) =>
                            setEditingVariable({
                              ...editingVariable,
                              name: e.target.value,
                            })
                          }
                          className="h-7 text-sm"
                        />
                        <Select
                          value={editingVariable.type}
                          onValueChange={(value) =>
                            setEditingVariable({
                              ...editingVariable,
                              type: value,
                              value: "",
                            })
                          }
                        >
                          <SelectTrigger className="h-7">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          {editingVariable.type === "boolean" ? (
                            <Select
                              value={editingVariable.value}
                              onValueChange={(value) =>
                                setEditingVariable({
                                  ...editingVariable,
                                  value,
                                })
                              }
                            >
                              <SelectTrigger className="h-7 flex-1">
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
                              onChange={(e) =>
                                setEditingVariable({
                                  ...editingVariable,
                                  value: e.target.value,
                                })
                              }
                              type={
                                editingVariable.type === "number"
                                  ? "number"
                                  : "text"
                              }
                              className="h-7 text-sm flex-1"
                            />
                          )}
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(dummy.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setEditingId(null)}
                              className="h-7 w-7 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {dummy.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            Value: {String(dummy.data)}
                          </span>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(dummy)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVizObj(dummy.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {!showCreateForm ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variable
                  </Button>
                ) : (
                  <div className="space-y-2 mt-4 p-2 bg-gray-50 rounded-md shadow-sm">
                    <Input
                      placeholder="Name"
                      value={newVariable.name}
                      onChange={(e) =>
                        setNewVariable({ ...newVariable, name: e.target.value })
                      }
                      className="h-7 text-sm"
                    />
                    <Select
                      value={newVariable.type}
                      onValueChange={(value) =>
                        setNewVariable({ ...newVariable, type: value })
                      }
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      {newVariable.type === "boolean" ? (
                        <Select
                          value={newVariable.value}
                          onValueChange={(value) =>
                            setNewVariable({ ...newVariable, value })
                          }
                        >
                          <SelectTrigger className="h-7 flex-1">
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
                          onChange={(e) =>
                            setNewVariable({
                              ...newVariable,
                              value: e.target.value,
                            })
                          }
                          type={
                            newVariable.type === "number" ? "number" : "text"
                          }
                          className="h-7 text-sm flex-1"
                        />
                      )}
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={handleCreateDummy}
                          className="h-7 w-7 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowCreateForm(false)}
                          className="h-7 w-7 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
