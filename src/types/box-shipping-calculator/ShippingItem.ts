/**
 * Shipping Item types for the Box Shipping Calculator
 * Defines the structure of shipping items and related types
 */

export interface ShippingItem {
  _id: string | null;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  sku?: string;
  deletedAt?: Date | null;
  updatedAt?: Date;
}

export interface SelectedShippingItem extends ShippingItem {
  quantity: number;
}

export default ShippingItem;
