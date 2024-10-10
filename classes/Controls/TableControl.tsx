
import React from "react";
import { Control, ControlConstructor } from "./Control";
import { obj, object_types } from "../vizobjects/obj";
import { useStore, getObjectSelector, setVizObjSelector, SetTableControl } from "@/app/store";
import {
  EditableObjectPopup,
  EditableObjectPopupProps,
} from "@/app/Components/EditMode/EditPopups/EditableObjectPopup";
import * as math from "mathjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import Latex from "react-latex-next";
import { atts } from "../vizobjects/get_set_obj_attributes";
import { FunctionStr, FunctionStrEditor } from './FunctionStr';
import { Validation_tableControl, Validation_tableControlConstructor, ValidationTableControlEditor } from "../Validation/Validation_tableControl";

interface TableCell<T extends obj> {
  value: number;
  functionStr: FunctionStr;
  obj_id: number;
  obj_type: object_types;
  attribute: string;
  isStatic: boolean;
}

interface TableRow<T extends obj> {
  cells: TableCell<T>[];
}

export interface TableControlConstructor<T extends obj>
  extends ControlConstructor {
  rows: TableRow<T>[];
  columnHeaders: string[];
  rowHeaders: string[];
}

export class TableControl<T extends obj> extends Control {
  rows: TableRow<T>[];
  columnHeaders: string[];
  rowHeaders: string[];

  constructor({
    id,
    desc = "Table Control",
    text = "This is a table control",
    rows,
    columnHeaders,
    rowHeaders,
  }: TableControlConstructor<T>) {
    super({ id, desc, text });
    this.rows = rows.map((row) => ({
      cells: row.cells.map((cell) => ({
        ...cell,
        isStatic: cell.isStatic || false,
      })),
    }));
    this.columnHeaders = columnHeaders;
    this.rowHeaders = rowHeaders;
  }

  setCellValue(rowIndex: number, cellIndex: number, value: number | ''): T | null {





    const cell = this.rows[rowIndex].cells[cellIndex];
    const obj = useStore.getState().vizobjs[cell.obj_id] as T;
    
  
    if (obj) {
      const numericValue = value === '' ? 0 : value;
      const func = cell.functionStr.get_function();
      const transformedValue = func(numericValue, useStore.getState);
      const setAttribute = atts[cell.obj_type]!["number"][cell.attribute].set_attribute;
      return setAttribute(obj, transformedValue);
    }
  
    return null;
  }

  dataBaseSave(): TableControlConstructor<T> & { type: string } {
    return {
      id: this.id,
      desc: this.desc,
      text: this.text,
      rows: this.rows,
      columnHeaders: this.columnHeaders,
      rowHeaders: this.rowHeaders,
      type: "TableControl",
    };
  }

  render(): React.ReactNode {
    return <ShowTableControl control={this} />;
  }

  static getPopup<T extends obj>({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (obj: TableControl<T>, validation?: Validation_tableControl<any>) => void;
  }) {
    const [editedObject, setEditedObject] = React.useState<
      TableControlConstructor<T>
    >({
      id: Date.now() % 10000,
      rows: [],
      columnHeaders: [],
      rowHeaders: [],
    });

    const [validation, setValidation] = React.useState<Validation_tableControlConstructor<any> | undefined>(undefined);

    const popupProps: EditableObjectPopupProps<TableControlConstructor<T>> = {
      isOpen,
      onClose,
      object: editedObject,
      set_object: setEditedObject,
      onSave: (updatedObject: TableControlConstructor<T>) => {
        const newObj = new TableControl(updatedObject);
        const newVal = validation ? new Validation_tableControl(validation) : undefined
        onSave(newObj, newVal);
      },
      title: `Create New Table Control`,
      fields: [
        { key: "desc", label: "Title", type: "title" },
        { key: "text", label: "Description", type: "textarea" },
        {
          key: "columnHeaders",
          label: "Column Headers",
          type: "custom",
          render: (value, onChange) => (
            <HeadersEditor
              headers={value}
              onChange={onChange}
              label="Column Headers"
            />
          ),
        },
        {
          key: "rowHeaders",
          label: "Row Headers",
          type: "custom",
          render: (value, onChange) => (
            <HeadersEditor
              headers={value}
              onChange={onChange}
              label="Row Headers"
            />
          ),
        },
        {
          key: "rows",
          label: "Table Cells",
          type: "custom",
          render: (value, onChange) => (
            <TableEditor
              rows={value}
              onChange={onChange}
              columnHeaders={editedObject.columnHeaders}
              rowHeaders={editedObject.rowHeaders}
            />
          ),
        },
      ],
      additionalContent: (
        <ValidationTableControlEditor
          onChange={(newValidation: Validation_tableControlConstructor<any> | undefined) => setValidation(newValidation)}
          controlId={editedObject.id}
          rows={editedObject.rows.length}
          columns={editedObject.columnHeaders.length}
        />
      ),
    };

    return <EditableObjectPopup {...popupProps} />;
  }
}

function ShowTableControl<T extends obj>({
  control,
}: {
  control: TableControl<T>;
}) {
  const setVizObj = useStore(setVizObjSelector);
  const setTableControl = useStore(SetTableControl);
  const [localValues, setLocalValues] = React.useState<(number | "")[][]>(
    control.rows.map((row) => row.cells.map((cell) => cell.value))
  );

  const updateTableControl = React.useCallback((rowIndex: number, cellIndex: number, value: string) => {
    const table_obj = control.clone();
    table_obj.rows[rowIndex].cells[cellIndex].value = value === "" ? 0 : parseFloat(value);
    setTableControl(table_obj);
  }, [control, setTableControl]);

  const handleCellChange = (
    rowIndex: number,
    cellIndex: number,
    value: string
  ) => {
    const newValue = value === "" ? "" : parseFloat(value);
    if (newValue === "" || !isNaN(newValue)) {
      // Update local state
      const newLocalValues = [...localValues];
      newLocalValues[rowIndex][cellIndex] = newValue;
      setLocalValues(newLocalValues);

      // Update table control in the store
      updateTableControl(rowIndex, cellIndex, value);

      // Update the object
      const updatedObj = control.setCellValue(
        rowIndex,
        cellIndex,
        newValue === "" ? 0 : newValue
      );
      if (updatedObj) {
        setVizObj(updatedObj.id, updatedObj);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        <Latex>{control.desc}</Latex>
      </h3>
      <p className="text-gray-600 mb-4">
        <Latex>{control.text}</Latex>
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {control.columnHeaders.map((header, index) => (
              <th key={index} className="border p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {control.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 font-medium">
                {control.rowHeaders[rowIndex]}
              </td>
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-2">
                  {cell.isStatic ? (
                    <span className="px-3 py-2">{cell.value}</span>
                  ) : (
                    <input
                      type="number"
                      value={localValues[rowIndex][cellIndex].toString()}
                      onChange={(e) =>
                        handleCellChange(rowIndex, cellIndex, e.target.value)
                      }
                      className="w-full px-3 py-2 text-base rounded-md border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:outline-none transition-all duration-200 ease-in-out"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HeadersEditor({
  headers,
  onChange,
  label,
}: {
  headers: string[];
  onChange: (headers: string[]) => void;
  label: string;
}) {
  const addHeader = () => {
    onChange([...headers, ""]);
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    onChange(newHeaders);
  };

  const removeHeader = (index: number) => {
    onChange(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      {headers.map((header, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={header}
            onChange={(e) => updateHeader(index, e.target.value)}
            placeholder={`${label} ${index + 1}`}
            className="flex-grow"
          />
          <Button
            onClick={() => removeHeader(index)}
            variant="ghost"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addHeader} variant="outline" className="w-full">
        Add {label.slice(0, -1)}
      </Button>
    </div>
  );
}

function TableEditor<T extends obj>({
  rows,
  onChange,
  columnHeaders,
  rowHeaders,
}: {
  rows: TableRow<T>[];
  onChange: (rows: TableRow<T>[]) => void;
  columnHeaders: string[];
  rowHeaders: string[];
}) {
  const vizobjs = useStore.getState().vizobjs;
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateCell = (
    rowIndex: number,
    cellIndex: number,
    field: keyof TableCell<T>,
    value: any
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].cells[cellIndex] = {
      ...newRows[rowIndex].cells[cellIndex],
      [field]: value,
    };
    onChange(newRows);
  };

  const addRow = () => {
    const newRow: TableRow<T> = {
      cells: columnHeaders.map(() => ({
        value: 0,
        functionStr: new FunctionStr(Date.now() % 10000, "x", []),
        obj_id: -1,
        obj_type: 'Obj',
        attribute: '',
        isStatic: false,
      })),
    };
    onChange([...rows, newRow]);
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="showAdvanced"
          checked={showAdvanced}
          onChange={(e) => setShowAdvanced(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showAdvanced">Show Advanced Options</label>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {columnHeaders.map((header, index) => (
              <th key={index} className="border p-2">
                {header}
              </th>
            ))}
            <th className="border p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 font-medium">{rowHeaders[rowIndex]}</td>
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-2">
                  <Input
                    type="number"
                    value={cell.value.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateCell(
                        rowIndex,
                        cellIndex,
                        "value",
                        value === '' ? '' : parseFloat(value) || 0
                      );
                    }}
                    placeholder="Cell value"
                    className="w-full mb-2"
                  />
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={cell.isStatic}
                      onChange={(e) =>
                        updateCell(
                          rowIndex,
                          cellIndex,
                          "isStatic",
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <label>Static Value</label>
                  </div>
                  {!cell.isStatic && (
                    <>
                      {showAdvanced && (
                        <FunctionStrEditor
                          value={cell.functionStr}
                          onChange={(value) =>
                            updateCell(rowIndex, cellIndex, "functionStr", value)
                          }
                        />
                      )}
                      <Select
                        value={cell.obj_id.toString()}
                        onValueChange={(value) => {
                          const objId = parseInt(value);
                          updateCell(rowIndex, cellIndex, "obj_id", objId);
                          const obj = vizobjs[objId] as T;
                          if (obj) {
                            updateCell(rowIndex, cellIndex, "obj_type", obj.type);
                            const setAttributeOptions = obj.get_set_att_selector("number");
                            const firstKey = Object.keys(setAttributeOptions)[0];
                            updateCell(rowIndex, cellIndex, "attribute", firstKey);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Select object" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">Select object</SelectItem>
                          {Object.entries(vizobjs).map(([id, obj]) => (
                            <SelectItem key={id} value={id}>
                              {obj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {cell.obj_id !== -1 && (
                        <Select
                          value={cell.attribute}
                          onValueChange={(value) => {
                            updateCell(rowIndex, cellIndex, "attribute", value);
                          }}
                        >
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select attribute" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys((vizobjs[cell.obj_id] as T).get_set_att_selector("number")).map((attr) => (
                              <SelectItem key={attr} value={attr}>
                                {attr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}
                </td>
              ))}
              <td className="border p-2">
                <Button
                  onClick={() => removeRow(rowIndex)}
                  variant="ghost"
                  size="icon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={addRow} variant="outline" className="w-full">
        Add Row
      </Button>
    </div>
  );
}
