/**
 * shipping.ts — Delivery options and prices for a quote
 *
 * Customers should see the whole cost (print + getting it to them) before they
 * submit, and Deej should have the shipping amount ready when sending the
 * payment link. Posted prices come from Australia Post's Postage Assessment
 * Calculator (PAC) API, which prices a parcel from its size, weight and the two
 * postcodes and doesn't need a shipping contract. Pickup and local delivery
 * are Deej's own rules, set in admin settings.
 *
 * Every function here fails soft: if the API is down or the part is too big to
 * post, the customer can still submit and Deej prices delivery by hand.
 */

import type { BoundingBoxMm } from "./stl-geometry";

const PAC_URL = "https://digitalapi.auspost.com.au/postage/parcel/domestic/service.json";

/** Australia Post's domestic parcel limits (105 cm longest side, 22 kg). */
const MAX_LENGTH_CM = 105;
const MAX_WEIGHT_KG = 22;
/** Frankston 3199, where parts are posted from and collected. */
export const DEFAULT_ORIGIN_POSTCODE = "3199";
/**
 * Postcodes close enough to drop off: Frankston, Seaford, Carrum Downs,
 * Langwarrin, Mount Eliza, Mornington and nearby. Editable in admin settings.
 */
export const DEFAULT_LOCAL_POSTCODES = ["3197", "3198", "3199", "3200", "3201", "3910", "3911", "3912", "3930", "3931", "3934"];

export interface ShippingSettings {
  originPostcode: string;
  localPostcodes: string[];
  /** 0 = free local delivery. */
  localDeliveryFee: number;
  /** Box, padding and tape, added to the plastic weight. */
  packagingGrams: number;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  originPostcode: DEFAULT_ORIGIN_POSTCODE,
  localPostcodes: DEFAULT_LOCAL_POSTCODES,
  localDeliveryFee: 0,
  packagingGrams: 150,
};

/**
 * Turns the admin settings document into shipping settings. "Free local
 * delivery" wins over a fee, so ticking it is enough to stop charging.
 */
export function shippingSettingsFrom(db: {
  originPostcode?: string;
  localPostcodes?: string[];
  localDeliveryFee?: number;
  packagingGrams?: number;
  freeLocalDelivery?: boolean;
} | null | undefined): ShippingSettings {
  return {
    originPostcode: db?.originPostcode || DEFAULT_SHIPPING_SETTINGS.originPostcode,
    localPostcodes: db?.localPostcodes?.length ? db.localPostcodes : DEFAULT_SHIPPING_SETTINGS.localPostcodes,
    localDeliveryFee: db?.freeLocalDelivery === false ? db.localDeliveryFee ?? 0 : 0,
    packagingGrams: db?.packagingGrams ?? DEFAULT_SHIPPING_SETTINGS.packagingGrams,
  };
}

export type DeliveryOptionId = "pickup" | "local_delivery" | "AUS_PARCEL_REGULAR" | "AUS_PARCEL_EXPRESS";

export interface DeliveryOption {
  id: DeliveryOptionId;
  /** Stored on the quote so the admin ships with the method that was quoted. */
  method: "pickup" | "local_delivery" | "shipped";
  label: string;
  price: number;
}

export interface Parcel {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
}

export function isValidPostcode(postcode: string): boolean {
  return /^\d{4}$/.test(postcode.trim());
}

/**
 * The box a job would go out in. Copies are stacked on their thinnest side,
 * each side gets 2 cm of padding, and sizes round up to whole centimetres the
 * way a real box would. Returns null when the parcel is over Australia Post's
 * limits, which means it needs a courier quote by hand.
 */
export function packParcel(sizeMm: BoundingBoxMm, gramsEach: number, quantity: number, packagingGrams: number): Parcel | null {
  const [a, b, c] = [sizeMm.x, sizeMm.y, sizeMm.z].map((mm) => mm / 10).sort((m, n) => n - m);
  const stacked = c * Math.max(1, quantity);
  const dims = [a, b, stacked].map((cm) => Math.ceil(cm + 4)).sort((m, n) => n - m);
  const weightKg = Math.round(((gramsEach * quantity + packagingGrams) / 1000) * 1000) / 1000;
  if (dims[0] > MAX_LENGTH_CM || weightKg > MAX_WEIGHT_KG) return null;
  return { lengthCm: dims[0], widthCm: dims[1], heightCm: dims[2], weightKg };
}

interface PacService {
  code: string;
  name: string;
  price: string;
}

/**
 * Parcel Post and Express Post prices from Australia Post. Satchels are left
 * out because whether a part fits one depends on its shape, which the box
 * size alone can't tell; Deej can still use one and keep the difference.
 */
export async function fetchPostagePrices(
  fromPostcode: string,
  toPostcode: string,
  parcel: Parcel,
  apiKey: string | undefined = process.env.AUSPOST_PAC_API_KEY,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryOption[]> {
  const params = new URLSearchParams({
    from_postcode: fromPostcode,
    to_postcode: toPostcode,
    length: String(parcel.lengthCm),
    width: String(parcel.widthCm),
    height: String(parcel.heightCm),
    weight: String(parcel.weightKg),
  });
  const res = await fetchImpl(`${PAC_URL}?${params}`, {
    headers: apiKey ? { "AUTH-KEY": apiKey } : {},
    // Prices change rarely; a short cache avoids a call on every slider move.
    next: { revalidate: 3600 },
  } as RequestInit);
  if (!res.ok) throw new Error(`Australia Post PAC returned ${res.status}`);
  const data = (await res.json()) as { services?: { service?: PacService | PacService[] } };
  // A single result comes back as an object, not a one-item array.
  const services = ([] as PacService[]).concat(data.services?.service ?? []);

  const wanted: Record<string, string> = { AUS_PARCEL_REGULAR: "Parcel Post", AUS_PARCEL_EXPRESS: "Express Post" };
  return services
    .filter((s) => s.code in wanted && Number(s.price) > 0)
    .map((s) => ({ id: s.code as DeliveryOptionId, method: "shipped" as const, label: wanted[s.code], price: Number(s.price) }));
}

/**
 * Every way this order can reach the customer, cheapest first. Pickup is
 * always there; local delivery only for nearby postcodes; posted options only
 * when the parcel is within limits and Australia Post answered.
 */
export async function getDeliveryOptions(input: {
  postcode: string;
  sizeMm: BoundingBoxMm;
  gramsEach: number;
  quantity: number;
  settings?: Partial<ShippingSettings>;
  fetchImpl?: typeof fetch;
}): Promise<{ options: DeliveryOption[]; postalUnavailable: string | null }> {
  const settings = { ...DEFAULT_SHIPPING_SETTINGS, ...input.settings };
  const options: DeliveryOption[] = [{ id: "pickup", method: "pickup", label: "Pickup in Frankston", price: 0 }];
  const postcode = input.postcode.trim();

  if (settings.localPostcodes.includes(postcode)) {
    options.push({ id: "local_delivery", method: "local_delivery", label: "Local delivery", price: settings.localDeliveryFee });
  }

  let postalUnavailable: string | null = null;
  const parcel = packParcel(input.sizeMm, input.gramsEach, input.quantity, settings.packagingGrams);
  if (!parcel) {
    postalUnavailable = "Too big to post as a parcel. I'll quote a courier by hand.";
  } else {
    try {
      options.push(...(await fetchPostagePrices(settings.originPostcode, postcode, parcel, undefined, input.fetchImpl)));
    } catch (err) {
      console.error("[shipping] Australia Post lookup failed:", err);
      postalUnavailable = "Couldn't get postage prices right now. I'll add shipping to your quote.";
    }
  }

  return { options: options.sort((a, b) => a.price - b.price), postalUnavailable };
}
