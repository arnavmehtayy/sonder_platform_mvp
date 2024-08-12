import React, { useState, ChangeEvent } from "react";
import {
  useStore,
  setInputNumberValueSelector,
  getControlSelector,
} from "../../store";
import { InputNumber } from "@/classes/Controls/InputNumber";

export default function ShowInputNumber({
  control_id,
}: {
  control_id: number;
}) {
  const setValue = useStore(setInputNumberValueSelector);
  const value = useStore(
    (state) => (state.controls[control_id] as InputNumber).value
  );
  const control = useStore(getControlSelector(control_id)) as InputNumber;

  const title = control.desc;
  const description = control.text;
  const placeholder = control.placeholder;
  const isClickable = control.isClickable;
  const initialValue = control.initial_value;
  const min = control.min;
  const max = control.max;
  const step = control.step;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isClickable) return;

    const newValue = e.target.value === "" ? "" : Number(e.target.value);
    setValue(control_id, newValue);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        !isClickable ? "opacity-50" : ""
      } relative`}
    >
      <h3 className="text-lg font-semibold text-blue-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={!isClickable}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-3 py-2 text-base rounded-md border transition-all duration-200 ease-in-out
            ${
              isClickable
                ? "border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                : "bg-gray-100 border-gray-300 cursor-not-allowed"
            }
            focus:outline-none
          `}
        />
      </div>
    </div>
  );
}
