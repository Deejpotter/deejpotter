import Stripe from "stripe";
import { createQuote, updateQuote, getQuote } from "@/lib/db-quotes";
import { setupMongoMemoryServer, teardownMongoMemoryServer } from "@/lib/mongoMemoryServer";

const SECRET = "whsec_test_secret";

describe("POST /api/webhooks/stripe", () => {
  let POST: typeof import("./route").POST;
  const saved = { ...process.env };

  beforeAll(async () => {
    const { uri } = await setupMongoMemoryServer();
    process.env.MONGODB_URI = uri;
    process.env.DB_NAME = "test";
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.STRIPE_WEBHOOK_SECRET = SECRET;
    delete process.env.RESEND_API_KEY;
    ({ POST } = await import("./route"));
  });

  afterAll(async () => {
    process.env = saved;
    await teardownMongoMemoryServer();
  });

  // Signs the payload the same way Stripe does, so the real signature check runs.
  const postEvent = (event: object, secret = SECRET) => {
    const payload = JSON.stringify(event);
    const header = Stripe.webhooks.generateTestHeaderString({ payload, secret });
    return POST(
      new Request("http://localhost/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": header },
        body: payload,
      }),
    );
  };

  const paidEvent = (id: string, quoteNumber: number, extra: Record<string, unknown> = {}) => ({
    id,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_${id}`,
        object: "checkout.session",
        metadata: { quoteNumber: String(quoteNumber) },
        payment_status: "paid",
        amount_total: 3020,
        ...extra,
      },
    },
  });

  async function quoteWithStatus(status: string) {
    const record = await createQuote({
      name: "Deej",
      email: "deej@example.com",
      suburb: "Frankston",
      serviceType: "3d_printing",
      params: { material: "PLA", quantity: 2 },
      delivery: { method: "pickup", suburb: "Frankston" },
      notes: "Need two brackets.",
    });
    await updateQuote(record.quoteNumber, { status: status as never, quotedPrice: 30.2 });
    return record.quoteNumber;
  }

  test("marks the quote paid, records the amount and adds a timeline entry", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    const res = await postEvent(paidEvent("evt_1", quoteNumber));
    expect(res.status).toBe(200);

    const quote = await getQuote(quoteNumber);
    expect(quote?.status).toBe("approved");
    expect(quote?.payment.amountPaid).toBe(30.2);
    expect(quote?.payment.stripeSessionId).toBe("cs_evt_1");
    expect(quote?.payment.paidAt).toBeTruthy();
    expect(quote?.statusHistory.at(-1)).toMatchObject({ status: "approved", by: "stripe" });
  });

  test("rejects a bad signature", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    const res = await postEvent(paidEvent("evt_bad", quoteNumber), "whsec_wrong");
    expect(res.status).toBe(400);
    expect((await getQuote(quoteNumber))?.status).toBe("awaiting_payment");
  });

  test("a repeated event is only processed once", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    await postEvent(paidEvent("evt_dup", quoteNumber));
    const second = await postEvent(paidEvent("evt_dup", quoteNumber));
    expect(await second.json()).toMatchObject({ duplicate: true });
    const history = (await getQuote(quoteNumber))?.statusHistory ?? [];
    expect(history.filter((h: { status: string }) => h.status === "approved")).toHaveLength(1);
  });

  test("doesn't revive a cancelled quote", async () => {
    const quoteNumber = await quoteWithStatus("cancelled");
    const res = await postEvent(paidEvent("evt_cancelled", quoteNumber));
    expect(res.status).toBe(200);
    expect((await getQuote(quoteNumber))?.status).toBe("cancelled");
  });

  test("waits for delayed payment methods to actually pay", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    await postEvent(paidEvent("evt_unpaid", quoteNumber, { payment_status: "unpaid" }));
    expect((await getQuote(quoteNumber))?.status).toBe("awaiting_payment");
  });

  test("pays delayed methods on async_payment_succeeded", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    await postEvent({ ...paidEvent("evt_async", quoteNumber), type: "checkout.session.async_payment_succeeded" });
    expect((await getQuote(quoteNumber))?.status).toBe("approved");
  });

  test("leaves the quote unpaid when an old payment link is paid", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    await updateQuote(quoteNumber, { paymentLinkId: "plink_current" });
    await postEvent(paidEvent("evt_stale", quoteNumber, { payment_link: "plink_old" }));
    expect((await getQuote(quoteNumber))?.status).toBe("awaiting_payment");
  });

  test("leaves the quote unpaid when the amount doesn't match the total", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    await postEvent(paidEvent("evt_amount", quoteNumber, { amount_total: 100 }));
    expect((await getQuote(quoteNumber))?.status).toBe("awaiting_payment");
  });

  test("takes over an event whose earlier attempt died mid-way", async () => {
    const quoteNumber = await quoteWithStatus("awaiting_payment");
    const { getCollection } = await import("@/lib/db");
    const events = await getCollection("stripe_events");
    // A claim from a crashed attempt, older than the lease.
    await events.insertOne({ _id: "evt_crashed", status: "processing", claimedAt: Date.now() - 10 * 60 * 1000 } as never);
    await postEvent(paidEvent("evt_crashed", quoteNumber));
    expect((await getQuote(quoteNumber))?.status).toBe("approved");
    expect(await events.findOne({ _id: "evt_crashed" } as never)).toMatchObject({ status: "done" });
  });

  test("ignores payments that aren't for a quote", async () => {
    const res = await postEvent({ ...paidEvent("evt_other", 0), data: { object: { id: "cs_x", metadata: {} } } });
    expect(res.status).toBe(200);
  });
});
