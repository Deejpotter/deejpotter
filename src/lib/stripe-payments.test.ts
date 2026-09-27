import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const create = vi.fn();
const update = vi.fn();

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(function StripeMock() {
    return { paymentLinks: { create, update } };
  }),
}));

import { createQuotePaymentLink, deactivatePaymentLink, resetStripeClientForTests } from "./stripe-payments";

describe("stripe payment links", () => {
  beforeEach(() => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
    resetStripeClientForTests();
    create.mockReset().mockResolvedValue({ id: "plink_1", url: "https://buy.stripe.com/test_1" });
    update.mockReset().mockResolvedValue({});
  });
  afterEach(() => vi.unstubAllEnvs());

  it("makes a single-use AUD link with the quote number and separate shipping", async () => {
    const link = await createQuotePaymentLink({ quoteNumber: 1005, price: 40.005, shippingCost: 11.7, shippingLabel: "Parcel Post" });
    expect(link).toEqual({ id: "plink_1", url: "https://buy.stripe.com/test_1" });

    const params = create.mock.calls[0][0];
    expect(params.metadata).toEqual({ quoteNumber: "1005" });
    expect(params.payment_intent_data.metadata).toEqual({ quoteNumber: "1005" });
    expect(params.restrictions).toEqual({ completed_sessions: { limit: 1 } });
    expect(params.line_items).toHaveLength(2);
    expect(params.line_items[0].price_data).toMatchObject({ currency: "aud", unit_amount: 4001 });
    expect(params.line_items[1].price_data).toMatchObject({ unit_amount: 1170, product_data: { name: "Parcel Post" } });
    expect(params.after_completion.redirect.url).toContain("/thank-you?quoteId=1005");
  });

  it("leaves shipping off for pickup", async () => {
    await createQuotePaymentLink({ quoteNumber: 1, price: 20, shippingCost: 0 });
    expect(create.mock.calls[0][0].line_items).toHaveLength(1);
  });

  it("refuses a zero price", async () => {
    await expect(createQuotePaymentLink({ quoteNumber: 1, price: 0 })).rejects.toThrow(/above \$0/);
    expect(create).not.toHaveBeenCalled();
  });

  it("explains a missing key", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    resetStripeClientForTests();
    await expect(createQuotePaymentLink({ quoteNumber: 1, price: 5 })).rejects.toThrow(/STRIPE_SECRET_KEY/);
  });

  it("deactivating never throws", async () => {
    update.mockRejectedValue(new Error("network"));
    await expect(deactivatePaymentLink("plink_1")).resolves.toBeUndefined();
    await deactivatePaymentLink(null);
    expect(update).toHaveBeenCalledTimes(1);
  });
});
