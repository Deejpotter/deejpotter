"use client";
import React, { useMemo, useState } from "react";

const FlowCompensationSection = () => {
  const [currentFlow, setCurrentFlow] = useState("100");
  const [nozzleWidth, setNozzleWidth] = useState("0.4");
  const [wallMeasurements, setWallMeasurements] = useState({ c1: "", c2: "", c3: "", c4: "" });

  const newFlow = useMemo(() => {
    const measurements = Object.values(wallMeasurements).map(Number);
    if (measurements.some(isNaN)) return "";

    const avgThickness = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    if (avgThickness === 0) return "";

    const currentFlowNum = Number(currentFlow);
    const nozzleWidthNum = Number(nozzleWidth);
    if (isNaN(currentFlowNum) || isNaN(nozzleWidthNum)) return "";

    return ((currentFlowNum * nozzleWidthNum) / avgThickness).toFixed(2);
  }, [currentFlow, nozzleWidth, wallMeasurements]);

  const handleCurrentFlowChange = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentFlow(e.target.value);
  const handleNozzleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => setNozzleWidth(e.target.value);
  const handleWallChange = (wall: keyof typeof wallMeasurements) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallMeasurements({ ...wallMeasurements, [wall]: e.target.value });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-green-100 bg-green-600 px-6 py-5 text-white dark:border-gray-700">
        <h2 className="text-xl font-bold">Flow Compensation</h2>
      </div>
      <div className="space-y-5 p-6 lg:p-8">
        <p className="text-gray-700 dark:text-gray-300">
          Flow compensation is used to correct for filament expansion when it is pressed against the layer underneath. Print a 20mm x 20mm x 20mm cube in vase mode,
          measure the top 5 layers near the center, and enter the values below.
          <span className="mt-2 block font-semibold">
            Note that flow compensation can differ based on material.
          </span>
        </p>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,220px)_minmax(0,1fr)] lg:items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="flow_old">
            Current Flow %
          </label>
          <div className="flex items-center gap-2">
            <input type="text" className={inputClass} id="flow_old" value={currentFlow} onChange={handleCurrentFlowChange} />
            <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              %
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Most slicers have flow compensation set to 100% by default.</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,220px)_minmax(0,1fr)] lg:items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="flow_nozzle">
            Nozzle Width
          </label>
          <div className="flex items-center gap-2">
            <input type="text" className={inputClass} id="flow_nozzle" value={nozzleWidth} onChange={handleNozzleWidthChange} />
            <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              mm
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter the diameter of your nozzle.</p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-start">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Measured Values</label>
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["c1", "c2", "c3", "c4"] as const).map((wall, index) => (
                <div key={wall} className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`${inputClass} text-sm`}
                    placeholder={`Side ${index + 1}`}
                    value={wallMeasurements[wall]}
                    onChange={handleWallChange(wall)}
                  />
                  <span className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    mm
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Measure the thickness of each side of the cube wall using the top 5 layers near the center of the wall.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">New Flow Percentage</h3>
          <p className="text-4xl font-extrabold text-green-600">{newFlow ? `${newFlow}%` : "—"}</p>
          {newFlow && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Enter this value into one or more fields of Cura&apos;s flow compensation fields. Shell/Skin values are most important to modify for accurate parts.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlowCompensationSection;
