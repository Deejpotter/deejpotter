"use client";
import React, { useMemo } from "react";
import type { MultiBoxPackingResult } from "./BoxCalculations";
import type ShippingBox from "@/types/box-shipping-calculator/ShippingBox";
import type { SelectedShippingItem } from "@/types/box-shipping-calculator/ShippingItem";
import { Package2, Scale, Ruler, AlertCircle } from "lucide-react";

interface BoxUtilizationMetrics {
  volumePercentage: number;
  weightPercentage: number;
  totalVolume: number;
  totalWeight: number;
  boxVolume: number;
}

interface BoxResultsDisplayProps {
  packingResult: MultiBoxPackingResult | null;
}

export function calculateBoxUtilization(box: ShippingBox, items: SelectedShippingItem[]): BoxUtilizationMetrics {
  const boxVolume = box.length * box.width * box.height;

  let totalItemsVolume = 0;
  let totalItemsWeight = 0;

  items.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemVolume = item.length * item.width * item.height * quantity;
    totalItemsVolume += itemVolume;
    totalItemsWeight += item.weight * quantity;
  });

  const volumePercentage = (totalItemsVolume / boxVolume) * 100;
  const weightPercentage = (totalItemsWeight / box.maxWeight) * 100;

  return { volumePercentage, weightPercentage, totalVolume: totalItemsVolume, totalWeight: totalItemsWeight, boxVolume };
}

export function calculateBoxDimensions(items: SelectedShippingItem[]) {
  if (!items || items.length === 0) {
    return { totalLength: 0, totalWidth: 0, totalHeight: 0, totalVolume: 0 };
  }

  const lengths = items.map((i) => i.length || 0);
  const widths = items.map((i) => i.width || 0);

  const totalLength = Math.max(...lengths);
  const totalWidth = Math.max(...widths);
  const totalHeight = items.reduce((acc, i) => acc + (i.height || 0) * (i.quantity || 1), 0);
  const totalVolume = items.reduce(
    (acc, i) => acc + (i.length || 0) * (i.width || 0) * (i.height || 0) * (i.quantity || 1),
    0
  );

  return { totalLength, totalWidth, totalHeight, totalVolume };
}

export function BoxResultsDisplay({ packingResult }: BoxResultsDisplayProps) {
  if (!packingResult) return null;

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Box Packing Results</h3>
      {packingResult.success ? (
        <>
          {packingResult.shipments.length === 0 ? (
            <div className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
              <AlertCircle size={18} />
              <span>No boxes needed for the selected items.</span>
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                Items will be packed into <strong>{packingResult.shipments.length}</strong> box(es).
              </p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {packingResult.shipments.map((shipment, index) => (
                  <ShipmentCard key={index} shipment={shipment} index={index} />
                ))}
              </div>
            </>
          )}

          {packingResult.unfitItems.length > 0 && <UnfitItemsCard items={packingResult.unfitItems} />}
        </>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Some items could not fit in any available box.</p>
              <UnfitItemsCard items={packingResult.unfitItems} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShipmentCard({ shipment, index }: { shipment: any; index: number }) {
  const metrics = useMemo(() => calculateBoxUtilization(shipment.box, shipment.packedItems), [shipment]);
  const itemDims = useMemo(() => calculateBoxDimensions(shipment.packedItems || []), [shipment]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2 bg-primary px-4 py-3 text-white">
        <Package2 size={20} />
        <h4 className="text-lg font-semibold">Box {index + 1}: {shipment.box.name}</h4>
      </div>
      <div className="space-y-4 p-4">
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Ruler size={16} />
            <span className="font-semibold text-gray-900 dark:text-white">Box Dimensions:</span>
            <span>{shipment.box.length} × {shipment.box.width} × {shipment.box.height} mm</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler size={16} />
            <span className="font-semibold text-gray-900 dark:text-white">Items Dimensions:</span>
            <span>{itemDims.totalLength} × {itemDims.totalWidth} × {itemDims.totalHeight} mm</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale size={16} />
            <span className="font-semibold text-gray-900 dark:text-white">Total Weight:</span>
            <span>{metrics.totalWeight}g / {shipment.box.maxWeight}g</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span>Weight Utilization:</span>
              <span>{metrics.weightPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${metrics.weightPercentage < 50 ? "bg-green-500" : metrics.weightPercentage < 85 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(metrics.weightPercentage, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span>Volume Utilization:</span>
              <span>{metrics.volumePercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${metrics.volumePercentage < 40 ? "bg-green-500" : metrics.volumePercentage < 80 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(metrics.volumePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <h5 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">Items in this box:</h5>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Weight</th>
                </tr>
              </thead>
              <tbody>
                {shipment.packedItems.map((item: SelectedShippingItem, idx: number) => (
                  <tr key={`${String(item._id)}-${idx}`} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-2">
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.length}×{item.width}×{item.height}mm</div>
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.quantity || 1}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.weight * (item.quantity || 1)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </article>
  );
}

function UnfitItemsCard({ items }: { items: SelectedShippingItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-3xl border border-red-200 bg-white shadow-sm dark:border-red-800 dark:bg-gray-800">
      <div className="flex items-center gap-2 rounded-t-3xl bg-red-600 px-4 py-3 text-white">
        <AlertCircle size={18} />
        <span className="font-semibold">Items That Don&apos;t Fit</span>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Dimensions</th>
                <th className="px-3 py-2 text-left">Weight</th>
                <th className="px-3 py-2 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String(item._id)} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.length}×{item.width}×{item.height}mm</td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.weight}g</td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{item.quantity || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-red-600 dark:text-red-300">
          These items exceed the dimensions or weight limits of all available boxes. Consider splitting large items or using custom shipping solutions.
        </p>
      </div>
    </div>
  );
}

export default BoxResultsDisplay;
