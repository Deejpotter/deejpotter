/**
 * Box Results Display Component
 * Updated: 14/05/2025
 * Author: Deej Potter
 * Description: Displays detailed information about box packing results.
 * This component visualizes the packing solution with metrics like weight and volume utilization.
 */

"use client";
import React, { useMemo } from "react";
import type { MultiBoxPackingResult } from "./BoxCalculations";
import type ShippingBox from "@/types/box-shipping-calculator/ShippingBox";
import type ShippingItem from "@/types/box-shipping-calculator/ShippingItem";
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

/**
 * Calculates the volume and weight utilization for a box with the given items
 *
 * @param box - The shipping box
 * @param items - Items packed in the box
 * @returns BoxUtilizationMetrics object with percentage and absolute values
 */
export function calculateBoxUtilization(
  box: ShippingBox,
  items: SelectedShippingItem[]
): BoxUtilizationMetrics {
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

  return {
    volumePercentage,
    weightPercentage,
    totalVolume: totalItemsVolume,
    totalWeight: totalItemsWeight,
    boxVolume,
  };
}

/**
 * Calculates aggregate dimensions and volume for a set of items.
 * - totalLength: max item length
 * - totalWidth: max item width
 * - totalHeight: sum of (item.height * quantity)
 * - totalVolume: sum of item volume * quantity
 */
export function calculateBoxDimensions(items: SelectedShippingItem[]) {
  if (!items || items.length === 0) {
    return {
      totalLength: 0,
      totalWidth: 0,
      totalHeight: 0,
      totalVolume: 0,
    };
  }

  const lengths = items.map((i) => i.length || 0);
  const widths = items.map((i) => i.width || 0);

  const totalLength = Math.max(...lengths);
  const totalWidth = Math.max(...widths);
  const totalHeight = items.reduce(
    (acc, i) => acc + (i.height || 0) * (i.quantity || 1),
    0
  );
  const totalVolume = items.reduce(
    (acc, i) =>
      acc +
      (i.length || 0) * (i.width || 0) * (i.height || 0) * (i.quantity || 1),
    0
  );

  return { totalLength, totalWidth, totalHeight, totalVolume };
}

/**
 * Displays visual box packing details including dimensions, weight, and utilization metrics
 */
export function BoxResultsDisplay({ packingResult }: BoxResultsDisplayProps) {
  if (!packingResult) {
    return null;
  }

  return (
    <div className="box-results mt-4">
      <h3 className="h4 mb-3">Box Packing Results</h3>
      {packingResult.success ? (
        <>
          {packingResult.shipments.length === 0 ? (
            <div className="alert alert-info">
              <AlertCircle size={18} className="me-2" />
              No boxes needed for the selected items.
            </div>
          ) : (
            <>
              <p className="mb-2">
                Items will be packed into{" "}
                <strong>{packingResult.shipments.length}</strong> box(es).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packingResult.shipments.map((shipment, index) => (
                  <div key={index} className="mb-3">
                    <ShipmentCard shipment={shipment} index={index} />
                  </div>
                ))}
              </div>
            </>
          )}

          {packingResult.unfitItems.length > 0 && (
            <UnfitItemsCard items={packingResult.unfitItems} />
          )}
        </>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <AlertCircle size={18} className="inline mr-2" />
          Some items could not fit in any available box.
          <UnfitItemsCard items={packingResult.unfitItems} />
        </div>
      )}
    </div>
  );
}

/**
 * Card component that displays information about a single shipment (box and its contents)
 */
function ShipmentCard({ shipment, index }: { shipment: any; index: number }) {
  const metrics = useMemo(() => {
    return calculateBoxUtilization(shipment.box, shipment.packedItems);
  }, [shipment]);

  // Aggregate items dimensions for display
  const itemDims = useMemo(() => {
    return calculateBoxDimensions(shipment.packedItems || []);
  }, [shipment]);

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm h-full">
      <div className="bg-blue-500 text-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <Package2 size={20} className="mr-2" />
          <h4 className="text-lg font-semibold mb-0">
            Box {index + 1}: {shipment.box.name}
          </h4>
        </div>
      </div>
      <div className="p-4">
        {/* Display box dimensions and weight utilization metrics */}
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <Ruler size={16} className="mr-1" />
            <span className="font-bold mr-2">Box Dimensions:</span>
            {shipment.box.length} × {shipment.box.width} × {shipment.box.height}{" "}
            mm
          </div>
          <div className="flex items-center mb-2">
            {" "}
            <Ruler size={16} className="mr-1" />
            <span className="font-bold mr-2">Items Dimensions:</span>
            {itemDims.totalLength} × {itemDims.totalWidth} ×{" "}
            {itemDims.totalHeight} mm
          </div>
          <div className="flex items-center mb-2">
            {" "}
            <Scale size={16} className="mr-1" />
            <span className="font-bold mr-2">Total Weight:</span>
            {metrics.totalWeight}g / {shipment.box.maxWeight}g
          </div>
          <div className="mb-2">
            <div className="flex justify-between">
              <span className="font-bold">Weight Utilization:</span>
              <span>{metrics.weightPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  metrics.weightPercentage < 50
                    ? "bg-green-500"
                    : metrics.weightPercentage < 85
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(metrics.weightPercentage, 100)}%` }}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between">
              <span className="font-bold">Volume Utilization:</span>
              <span>{metrics.volumePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  metrics.volumePercentage < 40
                    ? "bg-green-500"
                    : metrics.volumePercentage < 80
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(metrics.volumePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h5 className="text-base font-semibold mb-2">Items in this box:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3">Item</th>
                  <th className="text-left py-2 px-3">Qty</th>
                  <th className="text-left py-2 px-3">Weight</th>
                </tr>
              </thead>
              <tbody>
                {shipment.packedItems.map(
                  (item: SelectedShippingItem, idx: number) => (
                    <tr
                      key={`${String(item._id)}-${idx}`}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 px-3">
                        <div className="text-sm">{item.name}</div>
                        <div>
                          <small className="text-gray-600">
                            {item.length}×{item.width}×{item.height}mm
                          </small>
                        </div>
                      </td>
                      <td className="py-2 px-3">{item.quantity || 1}</td>
                      <td className="py-2 px-3">
                        {item.weight * (item.quantity || 1)}g
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Card component that displays information about items that couldn't fit in any box
 */
function UnfitItemsCard({ items }: { items: SelectedShippingItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-red-500 rounded mt-3">
      <div className="bg-red-500 text-white px-4 py-3 border-b border-red-500">
        <AlertCircle size={18} className="inline mr-2" />
        Items That Don&apos;t Fit
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3">Item</th>
                <th className="text-left py-2 px-3">Dimensions</th>
                <th className="text-left py-2 px-3">Weight</th>
                <th className="text-left py-2 px-3">Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String(item._id)} className="border-b border-gray-100">
                  <td className="py-2 px-3">{item.name}</td>
                  <td className="py-2 px-3">
                    {item.length}×{item.width}×{item.height}mm
                  </td>
                  <td className="py-2 px-3">{item.weight}g</td>
                  <td className="py-2 px-3">{item.quantity || 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-red-600 mt-2 mb-0">
          These items exceed the dimensions or weight limits of all available
          boxes. Consider splitting large items or using custom shipping
          solutions.
        </p>
      </div>
    </div>
  );
}

export default BoxResultsDisplay;
