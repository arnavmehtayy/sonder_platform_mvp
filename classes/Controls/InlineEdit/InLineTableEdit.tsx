import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Plus, Settings, Variable } from 'lucide-react';
import { TableControl } from '../TableControl';
import { Textarea } from "@/components/ui/textarea";
import { useStore } from '@/app/store';
import { FunctionStr } from '../FunctionStr';
import { obj } from '@/classes/vizobjects/obj';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FunctionStrEditor } from '../FunctionStr';

interface InlineTableEditProps<T extends obj> {
  control: TableControl<T>;
  onClose: () => void;
}

export const InlineTableEdit = <T extends obj>({ control, onClose }: InlineTableEditProps<T>) => {
  const [editedValues, setEditedValues] = React.useState({
    desc: control.desc,
    text: control.text,
    columnHeaders: [...control.columnHeaders],
    rowHeaders: [...control.rowHeaders],
    rows: control.rows.map(row => ({
      cells: row.cells.map(cell => ({ ...cell }))
    }))
  });

  const [selectedCell, setSelectedCell] = React.useState<{rowIndex: number, cellIndex: number} | null>(null);
  const allObjects = useStore(state => state.vizobjs);

  const handleSave = () => {
    const updatedControl = new TableControl({
      id: control.id,
      desc: editedValues.desc,
      text: editedValues.text,
      columnHeaders: editedValues.columnHeaders,
      rowHeaders: editedValues.rowHeaders,
      rows: editedValues.rows
    });
    useStore.getState().setControl(control.id, updatedControl);
    onClose();
  };

  const addColumn = () => {
    setEditedValues(prev => ({
      ...prev,
      columnHeaders: [...prev.columnHeaders, `Column ${prev.columnHeaders.length + 1}`],
      rows: prev.rows.map(row => ({
        cells: [...row.cells, {
          value: 0,
          functionStr: new FunctionStr("x", []),
          obj_id: -1,
          obj_type: 'Obj',
          attribute: '',
          isStatic: false
        }]
      }))
    }));
  };

  const addRow = () => {
    setEditedValues(prev => ({
      ...prev,
      rowHeaders: [...prev.rowHeaders, `Row ${prev.rowHeaders.length + 1}`],
      rows: [...prev.rows, {
        cells: prev.columnHeaders.map(() => ({
          value: 0,
          functionStr: new FunctionStr("x", []),
          obj_id: -1,
          obj_type: 'Obj',
          attribute: '',
          isStatic: false
        }))
      }]
    }));
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    setSelectedCell({ rowIndex, cellIndex });
  };

  const updateCellProperty = (
    rowIndex: number, 
    cellIndex: number, 
    property: string, 
    value: any
  ) => {
    const newRows = [...editedValues.rows];
    newRows[rowIndex].cells[cellIndex] = {
      ...newRows[rowIndex].cells[cellIndex],
      [property]: value
    };
    setEditedValues(prev => ({ ...prev, rows: newRows }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Basic Information */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Title</Label>
          <Input
            value={editedValues.desc}
            onChange={(e) => setEditedValues(prev => ({ ...prev, desc: e.target.value }))}
            className="text-lg font-semibold text-blue-800"
          />
        </div>
        
        <div>
          <Label className="text-xs text-gray-500">Description</Label>
          <Textarea
            value={editedValues.text}
            onChange={(e) => setEditedValues(prev => ({ ...prev, text: e.target.value }))}
            className="text-gray-600"
          />
        </div>
      </div>

      {/* Table Editor */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Table Content</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={addColumn}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2"></th>
                {editedValues.columnHeaders.map((header, index) => (
                  <th key={index} className="border p-2">
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...editedValues.columnHeaders];
                        newHeaders[index] = e.target.value;
                        setEditedValues(prev => ({ ...prev, columnHeaders: newHeaders }));
                      }}
                      className="w-full"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editedValues.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border p-2">
                    <Input
                      value={editedValues.rowHeaders[rowIndex]}
                      onChange={(e) => {
                        const newHeaders = [...editedValues.rowHeaders];
                        newHeaders[rowIndex] = e.target.value;
                        setEditedValues(prev => ({ ...prev, rowHeaders: newHeaders }));
                      }}
                      className="w-full"
                    />
                  </td>
                  {row.cells.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className={`border p-2 relative ${
                        selectedCell?.rowIndex === rowIndex && 
                        selectedCell?.cellIndex === cellIndex 
                          ? 'bg-blue-50' 
                          : ''
                      }`}
                      onClick={() => handleCellClick(rowIndex, cellIndex)}
                    >
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={cell.value}
                          onChange={(e) => {
                            updateCellProperty(
                              rowIndex,
                              cellIndex,
                              "value",
                              parseFloat(e.target.value) || 0
                            );
                          }}
                          className="w-full"
                        />
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={cell.isStatic}
                            onCheckedChange={(checked) => {
                              updateCellProperty(rowIndex, cellIndex, "isStatic", checked);
                            }}
                          />
                          <span className="text-sm text-gray-600">Static</span>
                        </div>

                        {!cell.isStatic && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full flex justify-between items-center"
                              >
                                <span className="text-xs">Cell Properties</span>
                                <Settings className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2 pt-2">
                              <Select
                                value={cell.obj_id.toString()}
                                onValueChange={(value) => {
                                  const objId = parseInt(value);
                                  updateCellProperty(rowIndex, cellIndex, "obj_id", objId);
                                  const obj = allObjects[objId];
                                  if (obj) {
                                    updateCellProperty(rowIndex, cellIndex, "obj_type", obj.type);
                                    updateCellProperty(rowIndex, cellIndex, "attribute", '');
                                  }
                                }}
                              >
                                <Label className="text-xs text-gray-500">Select Object</Label>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select object" />
                                </SelectTrigger>
      
                                <SelectContent>
                                  {Object.values(allObjects).map((obj) => (
                                    <SelectItem key={obj.id} value={obj.id.toString()}>
                                      {obj.name || `Object ${obj.id}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {cell.obj_id !== -1 && (
                                <>
                                  <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Object Attribute</Label>
                                    <Select
                                      value={cell.attribute}
                                      onValueChange={(value) => {
                                        updateCellProperty(rowIndex, cellIndex, "attribute", value);
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select attribute" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.keys(allObjects[cell.obj_id]?.get_set_att_selector("number") || {}).map((attr) => (
                                          <SelectItem key={attr} value={attr}>
                                            {attr}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <Collapsible>
                                    <CollapsibleTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="w-full flex justify-between items-center"
                                      >
                                        <span className="text-xs">Advanced Settings</span>
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2">
                                      <FunctionStrEditor
                                        value={cell.functionStr}
                                        onChange={(value) => {
                                          updateCellProperty(
                                            rowIndex,
                                            cellIndex,
                                            "functionStr",
                                            value
                                          );
                                        }}
                                      />
                                    </CollapsibleContent>
                                  </Collapsible>
                                </>
                              )}
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          variant="default"
          size="sm"
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Check className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
}; 