import { describe, expect, it, vi } from "vitest";
import { getDeliveryOptions, packParcel, shippingSettingsFrom } from "./shipping";

const pacResponse = {
  services: {
    service: [
      { code: "AUS_PARCEL_EXPRESS", name: "Express Post", price: "15.20" },
      { code: "AUS_PARCEL_REGULAR", name: "Parcel Post", price: "11.70" },
      { code: "AUS_PARCEL_REGULAR_SATCHEL_MEDIUM", name: "Medium", price: "16.40" },
    ],
  },
};
const okFetch = vi.fn(async () => new Response(JSON.stringify(pacResponse), { status: 200 })) as unknown as typeof fetch;

describe("packParcel", () => {
  it("pads each side, stacks copies on the thinnest side and adds packaging weight", () => {
    const parcel = packParcel({ x: 100, y: 50, z: 20 }, 40, 3, 150);
    expect(parcel).toEqual({ lengthCm: 14, widthCm: 10, heightCm: 9, weightKg: 0.27 });
  });

  it("refuses parcels over Australia Post limits", () => {
    expect(packParcel({ x: 1100, y: 100, z: 100 }, 100, 1, 150)).toBeNull();
    expect(packParcel({ x: 100, y: 100, z: 100 }, 23000, 1, 150)).toBeNull();
  });
});

describe("getDeliveryOptions", () => {
  const base = { sizeMm: { x: 80, y: 60, z: 30 }, gramsEach: 50, quantity: 1 };

  it("offers pickup, local delivery and post for a nearby postcode, cheapest first", async () => {
    const { options } = await getDeliveryOptions({ ...base, postcode: "3199", fetchImpl: okFetch });
    expect(options.map((o) => o.id)).toEqual(["pickup", "local_delivery", "AUS_PARCEL_REGULAR", "AUS_PARCEL_EXPRESS"]);
    expect(options.find((o) => o.id === "AUS_PARCEL_REGULAR")?.price).toBe(11.7);
  });

  it("skips local delivery further away and ignores satchels", async () => {
    const { options } = await getDeliveryOptions({ ...base, postcode: "2000", fetchImpl: okFetch });
    expect(options.map((o) => o.id)).toEqual(["pickup", "AUS_PARCEL_REGULAR", "AUS_PARCEL_EXPRESS"]);
  });

  it("still offers pickup when Australia Post is down", async () => {
    const down = vi.fn(async () => new Response("nope", { status: 503 })) as unknown as typeof fetch;
    const result = await getDeliveryOptions({ ...base, postcode: "2000", fetchImpl: down });
    expect(result.options.map((o) => o.id)).toEqual(["pickup"]);
    expect(result.postalUnavailable).toMatch(/add shipping/);
  });

  it("handles a single service returned as an object", async () => {
    const single = vi.fn(async () =>
      new Response(JSON.stringify({ services: { service: { code: "AUS_PARCEL_REGULAR", name: "Parcel Post", price: "9.00" } } })),
    ) as unknown as typeof fetch;
    const { options } = await getDeliveryOptions({ ...base, postcode: "2000", fetchImpl: single });
    expect(options.at(-1)).toMatchObject({ id: "AUS_PARCEL_REGULAR", price: 9 });
  });
});

describe("shippingSettingsFrom", () => {
  it("charges the local fee only when free local delivery is off", () => {
    expect(shippingSettingsFrom({ freeLocalDelivery: true, localDeliveryFee: 12 }).localDeliveryFee).toBe(0);
    expect(shippingSettingsFrom({ freeLocalDelivery: false, localDeliveryFee: 12 }).localDeliveryFee).toBe(12);
    expect(shippingSettingsFrom(null).originPostcode).toBe("3199");
  });
});
