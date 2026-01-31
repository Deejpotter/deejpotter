/**
 * Shipping Box types for the Box Shipping Calculator
 * Defines the structure of shipping boxes and calculation results
 */

export interface ShippingBox {
  _id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight?: number;
  maxWeight: number;
}

export interface BoxCalculationResult {
  box: ShippingBox;
  items: Array<{
    item: any; // SelectedShippingItem
    quantity: number;
  }>;
  totalWeight: number;
  totalVolume: number;
  utilization: number;
}

export default ShippingBox;
