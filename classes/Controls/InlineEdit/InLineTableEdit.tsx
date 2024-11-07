import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { TableControl } from '../TableControl';
import { Textarea } from "@/components/ui/textarea";
import { useStore } from '@/app/store';
import { FunctionStr } from '../FunctionStr';
import { obj } from '@/classes/vizobjects/obj';

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
                  <td key={cellIndex} className="border p-2">
                    <Input
                      type="number"
                    //   value={cell.value}
                      onChange={(e) => {
                        const newRows = [...editedValues.rows];
                        newRows[rowIndex].cells[cellIndex].value = parseFloat(e.target.value) || 0;
                        setEditedValues(prev => ({ ...prev, rows: newRows }));
                      }}
                      className="w-full"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
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