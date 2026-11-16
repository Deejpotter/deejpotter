import { beforeEach, describe, expect, it, vi } from "vitest";
import { addItem, deleteItem, loadItems, resetItems, SAMPLE_ITEMS, updateItem } from "./itemStore";

// The test DOM has no localStorage, so use a small in-memory one.
function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

describe("itemStore", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: memoryStorage(), configurable: true });
  });

  it("starts with the sample items", () => {
    expect(loadItems()).toEqual(SAMPLE_ITEMS);
  });

  it("keeps added, edited and deleted items between loads", () => {
    const { _id, ...newItem } = SAMPLE_ITEMS[0];
    const added = addItem({ ...newItem, name: "Test item" }, loadItems());
    const item = added[added.length - 1];
    expect(item._id).toBeTruthy();
    expect(loadItems()).toHaveLength(SAMPLE_ITEMS.length + 1);

    updateItem({ ...item, name: "Renamed" }, added);
    expect(loadItems().some((i) => i.name === "Renamed")).toBe(true);

    deleteItem(String(item._id), loadItems());
    expect(loadItems()).toEqual(SAMPLE_ITEMS);
  });

  it("restores the samples on reset", () => {
    deleteItem("sample-1", loadItems());
    expect(resetItems()).toEqual(SAMPLE_ITEMS);
    expect(loadItems()).toEqual(SAMPLE_ITEMS);
  });

  it("falls back to the samples when stored data is corrupt or storage is blocked", () => {
    window.localStorage.setItem("box-shipping-calculator-items", "{not json");
    expect(loadItems()).toEqual(SAMPLE_ITEMS);

    window.localStorage.setItem("box-shipping-calculator-items", "[null]");
    expect(loadItems()).toEqual(SAMPLE_ITEMS);

    window.localStorage.setItem("box-shipping-calculator-items", "[{}]");
    expect(loadItems()).toEqual(SAMPLE_ITEMS);

    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(loadItems()).toEqual(SAMPLE_ITEMS);
  });
});
