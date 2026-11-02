import ShippingItem from "@/types/box-shipping-calculator/ShippingItem";

// The site is a static export with no backend, so items live in the visitor's
// browser. Storage can be blocked or empty, so every access falls back to the
// sample items and the calculator still works for that visit.
const STORAGE_KEY = "box-shipping-calculator-items";

export const SAMPLE_ITEMS: ShippingItem[] = [
  { _id: "sample-1", name: "V-slot extrusion 2020 x 500mm", sku: "SAMPLE-EXT-500", length: 500, width: 20, height: 20, weight: 310 },
  { _id: "sample-2", name: "V-slot extrusion 2040 x 1000mm", sku: "SAMPLE-EXT-1000", length: 1000, width: 40, height: 20, weight: 1100 },
  { _id: "sample-3", name: "NEMA 23 stepper motor", sku: "SAMPLE-MTR-23", length: 76, width: 57, height: 57, weight: 1000 },
  { _id: "sample-4", name: "Lead screw 8mm x 300mm", sku: "SAMPLE-LS-300", length: 300, width: 10, height: 10, weight: 95 },
  { _id: "sample-5", name: "Linear rail carriage", sku: "SAMPLE-CAR-15", length: 60, width: 34, height: 28, weight: 170 },
  { _id: "sample-6", name: "Bearing pack (10)", sku: "SAMPLE-BRG-10", length: 80, width: 60, height: 20, weight: 60 },
];

export function loadItems(): ShippingItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed : [...SAMPLE_ITEMS];
  } catch {
    return [...SAMPLE_ITEMS];
  }
}

function saveItems(items: ShippingItem[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Blocked storage only means changes last until the page is closed.
  }
}

export function addItem(item: Omit<ShippingItem, "_id">, items: ShippingItem[]): ShippingItem[] {
  const next = [...items, { ...item, _id: crypto.randomUUID() }];
  saveItems(next);
  return next;
}

export function updateItem(updated: ShippingItem, items: ShippingItem[]): ShippingItem[] {
  const next = items.map((item) => (item._id === updated._id ? updated : item));
  saveItems(next);
  return next;
}

export function deleteItem(id: string, items: ShippingItem[]): ShippingItem[] {
  const next = items.filter((item) => item._id !== id);
  saveItems(next);
  return next;
}

export function resetItems(): ShippingItem[] {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored to clear.
  }
  return [...SAMPLE_ITEMS];
}
