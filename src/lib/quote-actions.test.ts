import { beforeAll, afterAll, describe, expect, test, vi } from "vitest";

let linkCount = 0;
const deactivated: string[] = [];
vi.mock("./stripe-payments", () => ({
  createQuotePaymentLink: vi.fn(async () => {
    linkCount += 1;
    return { id: `plink_${linkCount}`, url: `https://buy.stripe.com/test_${linkCount}` };
  }),
  deactivatePaymentLink: vi.fn(async (id: string | null) => {
    if (id) deactivated.push(id);
  }),
}));

import { createQuote, getQuote } from "./db-quotes";
import { setupMongoMemoryServer, teardownMongoMemoryServer } from "./mongoMemoryServer";
import { performQuoteAction } from "./quote-actions";

describe("performQuoteAction", () => {
  const saved = { ...process.env };

  beforeAll(async () => {
    const { uri } = await setupMongoMemoryServer();
    process.env.MONGODB_URI = uri;
    process.env.DB_NAME = "test_actions";
    delete process.env.RESEND_API_KEY;
  });

  afterAll(async () => {
    process.env = saved;
    await teardownMongoMemoryServer();
  });

  test("two Send quote clicks at once leave one payable link", async () => {
    const { quoteNumber } = await createQuote({
      name: "Sam",
      email: "sam@example.com",
      suburb: "Frankston",
      serviceType: "3d_printing",
      params: { material: "PLA", quantity: 1 },
      delivery: { method: "pickup" },
    });

    const results = await Promise.allSettled([
      performQuoteAction(quoteNumber, "send_quote", { price: 20 }),
      performQuoteAction(quoteNumber, "send_quote", { price: 25 }),
    ]);

    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const loser = results.find((r) => r.status === "rejected") as PromiseRejectedResult;
    expect(loser.reason.status).toBe(409);

    const quote = await getQuote(quoteNumber);
    // The losing attempt's link was switched off; the saved one wasn't.
    expect(deactivated).toHaveLength(1);
    expect(deactivated[0]).not.toBe(quote?.payment.paymentLinkId);
    expect(quote?.statusHistory.filter((h: { status: string }) => h.status === "awaiting_payment")).toHaveLength(1);
  });

  test("reports when the customer email didn't send", async () => {
    const { quoteNumber } = await createQuote({
      name: "Sam",
      email: "sam@example.com",
      suburb: "Frankston",
      serviceType: "3d_printing",
      params: { material: "PLA", quantity: 1 },
      delivery: { method: "pickup" },
    });
    // No RESEND_API_KEY, so nothing can be sent.
    const updated = await performQuoteAction(quoteNumber, "send_quote", { price: 20 });
    expect(updated.emailSent).toBe(false);
    expect(updated.status).toBe("awaiting_payment");
  });
});
