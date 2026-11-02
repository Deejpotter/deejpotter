/**
 * Box Shipping Calculator Page
 * Author: Deej Potter
 * Description: Main UI for the box shipping calculator. Items are kept in the
 * visitor's browser (see itemStore.ts) and packing runs client side.
 */

"use client";

import React, { useState } from "react";
import ShippingItem, {
  SelectedShippingItem,
} from "@/types/box-shipping-calculator/ShippingItem";
import ItemAddForm from "./ItemAddForm";
import ItemSelectAndCalculate from "./ItemSelectAndCalculate";
import BoxResultsDisplay from "./BoxResultsDisplay";
import LayoutContainer from "@/components/LayoutContainer";
import {
  packItemsIntoMultipleBoxes,
  MultiBoxPackingResult,
} from "./BoxCalculations";
import { addItem, loadItems, resetItems } from "./itemStore";

/**
 * Box Shipping Calculator Page Component
 */
const BoxShippingCalculatorPage: React.FC = () => {
  const [items, setItems] = useState<ShippingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedShippingItem[]>(
    []
  );
  const [packingResult, setPackingResult] =
    useState<MultiBoxPackingResult | null>(null);

  const handleAddItem = (item: Omit<ShippingItem, "_id">) => {
    setItems((prevItems) => addItem(item, prevItems));
  };

  const handleReset = () => {
    setItems(resetItems());
    setSelectedItems([]);
    setPackingResult(null);
  };

  const handleCalculateBox = (itemsToCalculate: SelectedShippingItem[]) => {
    const result = packItemsIntoMultipleBoxes(itemsToCalculate);
    setPackingResult(result);
  };

  return (
    <LayoutContainer>
      <div className="max-w-7xl mx-auto pb-5 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Box Shipping Calculator</h1>
          <button
            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
            onClick={handleReset}
          >
            Reset to samples
          </button>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Pick some items and it finds the fewest boxes to ship them in. The
          list starts with sample parts. Anything you add stays in this browser.
        </p>

        <div className="space-y-4">
          {/* Item Selection and Calculation Section */}
          <div className="w-full">
            <div className="bg-gray-100 shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-3">Select Items</h2>
              <ItemSelectAndCalculate
                availableItems={items}
                selectedItems={selectedItems}
                onSelectedItemsChange={setSelectedItems}
                onCalculateBox={handleCalculateBox}
                onItemsChange={() => setItems(loadItems())}
                onItemsReplaced={setItems}
              />
            </div>
          </div>
          {/* Box Results Display */}
          {packingResult && (
            <div className="w-full">
              <div className="bg-gray-100 shadow rounded p-4">
                <h2 className="text-xl font-semibold mb-3">
                  Calculation Results
                </h2>
                <BoxResultsDisplay packingResult={packingResult} />
              </div>
            </div>
          )}
          {/* Manual Item Addition Form */}
          <div className="w-full">
            <div className="bg-gray-100 shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-3">
                Manually Add New Item
              </h2>
              <ItemAddForm onAddItem={handleAddItem} />
            </div>
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default BoxShippingCalculatorPage;
