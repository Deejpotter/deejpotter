"use client";
import React, { useMemo, useState } from "react";

const StepsPerMmSection = () => {
  const [currentSteps, setCurrentSteps] = useState("");
  const [expectedMovement, setExpectedMovement] = useState("100");
  const [actualMovement, setActualMovement] = useState("");

  const newSteps = useMemo(() => {
    const currentStepsNum = Number(currentSteps);
    const expectedMovementNum = Number(expectedMovement);
    const actualMovementNum = Number(actualMovement);

    if (
      actualMovementNum === 0 ||
      isNaN(currentStepsNum) ||
      isNaN(expectedMovementNum) ||
      isNaN(actualMovementNum)
    ) {
      return "";
    }

    const calculatedSteps = (currentStepsNum * expectedMovementNum) / actualMovementNum;
    return calculatedSteps.toFixed(2);
  }, [currentSteps, expectedMovement, actualMovement]);

  const handleChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setter(e.target.value);

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-100 bg-primary px-6 py-5 text-white dark:border-gray-700">
        <h2 className="text-xl font-bold">Steps per millimeter</h2>
      </div>
      <div className="space-y-4 p-6 lg:p-8">
        <p className="text-gray-700 dark:text-gray-300">
          The steps per millimeter (steps/mm) calculation is used to calibrate the X, Y, Z, and E axes of your CNC machine.
          The calculator adjusts your steps/mm based on the measured value so the new value matches the target.
        </p>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,220px)_minmax(0,1fr)] lg:items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="spm_old">
            Current Steps/mm
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className={inputClass}
              id="spm_old"
              value={currentSteps}
              onChange={handleChange(setCurrentSteps)}
              placeholder="Enter value"
            />
            <span className="whitespace-nowrap rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              steps/mm
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <code>M503</code> G-Code will reveal the <code>M92</code> values. Use your existing X/Y/Z/E value for this field.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,220px)_minmax(0,1fr)] lg:items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="spm_target">
            Target Value
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className={inputClass}
              id="spm_target"
              value={expectedMovement}
              onChange={handleChange(setExpectedMovement)}
            />
            <span className="whitespace-nowrap rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              mm
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">The expected amount of axis movement. For example, enter 100 if you move the axis 100mm.</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,220px)_minmax(0,1fr)] lg:items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="spm_measured">
            Measured Value
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className={inputClass}
              id="spm_measured"
              value={actualMovement}
              onChange={handleChange(setActualMovement)}
              placeholder="Enter value"
            />
            <span className="whitespace-nowrap rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              mm
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">The actual amount of axis movement. Use calipers if you have them, otherwise a metric ruler works.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">New Steps/mm Value</h3>
          <p className="text-4xl font-extrabold text-primary">{newSteps || "—"}</p>
          {newSteps && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Enter this value, up to 2 decimal places, into Marlin for the axis you are calibrating. For example <code>M92 X{newSteps}</code>.
              Save your configuration with <code>M500</code>.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StepsPerMmSection;
