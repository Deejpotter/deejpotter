Title: Quote to order flow: automatic statuses, Stripe payment links, shipping

Status: In progress (2026-09-27). Decisions: Stripe only, MyPost Business, "Being reviewed" automatic
Owner: @dev
Priority: High (needed before selling)

## Goal

A customer's quote moves through its statuses on its own wherever it can. Each admin step is one button. Every change emails the customer. Payment and shipping are connected to the admin page, so nothing is copied between systems by hand.

## Status flow

| Status (customer sees) | Internal | What moves it | Email to customer |
|---|---|---|---|
| Received | `new` | Automatic: quote form submitted | Yes (exists) |
| Being reviewed | `reviewing` | Automatic: admin first opens the quote | No |
| Quote sent, payment link in your email | `awaiting_payment` | Admin "Send quote": enter price, turnaround and shipping, then the site creates a Stripe Payment Link and emails it | Yes, with link |
| Paid | `approved` | Automatic: Stripe `checkout.session.completed` webhook | Yes, receipt; admin notified |
| Printing | `in_progress` | Admin "Start" | Yes |
| Ready for pickup / Shipped | `ready` | Admin "Ready" (pickup/local) or "Ship" (enter tracking number) | Yes; shipped email has tracking link |
| Delivered / Completed | `completed` | Admin "Complete", or automatic from tracking later (phase 3) | Yes |
| Declined / Cancelled | `declined` / `cancelled` | Admin button; payment link deactivated | Yes |

`quoted` is dropped from the flow: sending the quote and the payment link is one step. Admin can still set any status by hand to fix mistakes, but only the buttons send emails.

## Payments: Stripe

- **Why Stripe over PayPal:** Stripe's domestic card fee is 1.7% + A$0.30, with lower pricing from 1 October 2026 ([Stripe, n.d.](#ref-stripe-pricing)). PayPal's standard domestic rate is reported at 2.9% + A$0.30 ([ComKey Consulting, 2026](#ref-comkey-paypal)). The Stripe connection already exists in the code.
- **Payment Links, not an on-site checkout.** The site creates a Payment Link per quote with the quote number in `metadata`. Metadata set on a Payment Link is copied to the Checkout Sessions it creates ([Stripe, n.d.-b](#ref-stripe-paymentlink-create)), so the existing webhook can find the quote when payment completes. Links don't expire like Checkout Sessions, so a customer can pay days later.
- **Removed:** the "Pay now" buttons (status page, account page), `/api/quotes/checkout`, `/api/stripe/quote-checkout`, the payment-cancelled page. Kept and adapted: `/api/webhooks/stripe`, the thank-you page (the Payment Link's redirect after payment).
- **Surcharges:** reported to be banned on eftpos, Mastercard and Visa from 1 October 2026 ([Bold Rails, 2026](#ref-boldrails)). Build the fee into the price rather than adding a card surcharge. (Check against the RBA before relying on it.)
- **Staging:** needs Stripe test keys and a test webhook secret (Deej, in Render).

## Shipping

Sendle stopped taking new bookings on 11 January 2026 ([Starshipit, 2026](#ref-starshipit-sendle)), so it's out. Australia Post's Shipping and Tracking APIs need an eParcel or StarTrack contract ([Australia Post, n.d.](#ref-auspost-integrate)). MyPost Business accounts reach them through platforms such as ShipStation, which connects a MyPost Business account to print labels and track ([ShipStation, n.d.](#ref-shipstation-mypost)).

- **Phase 1 (no contract needed):** "Ship" asks for carrier and tracking number, stores them on the quote, and emails the customer a tracking link. Shipping cost is entered by hand when sending the quote and added to the payment link as a separate line.
- **Phase 2:** shipping price by postcode and parcel size at quote time, so the customer sees it on the quote form.
- **Phase 3:** buy labels and get tracking updates (delivered to completed automatically) through ShipStation (or similar) on a MyPost Business account.

## Data changes

- Quote: `payment.paymentLinkId`, `payment.paymentLinkUrl`, `payment.paidAt`, `payment.amountPaid`
- Quote: `shipping.cost`, `shipping.carrier`, `shipping.trackingNumber`, `shipping.shippedAt`
- Quote: `statusHistory[]` (status, at, by) so admin and customer see a timeline
- Webhook events stored by id (exists) so repeats are ignored

## Implementation plan (2026-09-27)

Branch `feat/quote-order-flow`. Each step gives the reasoning, then the sub-steps. Progress is ticked off in `.github/TODOs.md`.

### Step 1: Order data and the status workflow
**Why:** Every other step (admin buttons, emails, Stripe, customer timeline) needs one place that decides which status comes next and what gets recorded. If that logic is spread across routes, a button and the webhook can disagree about what "paid" means. New fields are optional so existing quotes in MongoDB still validate.
- 1.1 Schema: `payment` gains `paymentLinkId`, `paymentLinkUrl`, `amountPaid`; `delivery` gains `service`, `carrier`, `trackingNumber`, `shippedAt`; the quote gains `statusHistory[]`
- 1.2 `src/lib/quote-workflow.ts`: customer-facing status labels, the admin actions allowed from each status, and the status each action leads to
- 1.3 `db-quotes.ts`: write the new fields, add history entries, and `markQuotesReviewed()` (new to reviewing, once)
- 1.4 Tests for the allowed transitions

### Step 2: Emails for each status
**Why:** The customer should never have to check the site to know what's happening. Each action needs its own wording (a payment email needs the link, a shipped email needs tracking), so one generic "status changed" email isn't enough.
- 2.1 Templates: quote sent (price, shipping, link), paid (receipt), printing, ready for pickup, out for delivery, shipped (tracking link), completed, declined, cancelled
- 2.2 Admin email when a payment comes in
- 2.3 Plain-text subjects with line breaks stripped (header injection), HTML escaped
- 2.4 Template tests

### Step 3: Stripe Payment Links
**Why:** Deej sends the payment link, but the site makes it, so the quote number is attached and the webhook can mark the right quote paid. Payment Links don't expire like Checkout Sessions, so a customer can pay days later.
- 3.1 `src/lib/stripe-payments.ts`: link with print and shipping as separate lines, `metadata.quoteNumber`, redirect to the thank-you page, one completed payment only
- 3.2 Deactivate the link on cancel or decline, after payment, and when the quote is re-sent
- 3.3 Tests with Stripe mocked

### Step 4: Webhook marks quotes paid
**Why:** This is the step that has to be automatic. It must survive Stripe sending the same event twice and Render restarting, so processed event ids go in MongoDB instead of memory.
- 4.1 `checkout.session.completed` with `metadata.quoteNumber`: record the payment, move to paid, deactivate the link, send emails
- 4.2 `stripe_events` collection for idempotency
- 4.3 Drop the old session-expired handling (links don't expire)
- 4.4 Update the webhook tests

### Step 5: Admin actions
**Why:** One button per step replaces the free-form status dropdown, so emails and Stripe happen as part of the button rather than being something to remember.
- 5.1 `POST /api/admin/quotes/action` (send_quote, start, ready, ship, complete, decline, cancel)
- 5.2 Loading the admin list marks new quotes as reviewing
- 5.3 Admin UI: action buttons, "Send quote" form (price, shipping, turnaround, prefilled from the estimate), "Ship" form (carrier, tracking number), payment link and timeline
- 5.4 Keep a manual status override that sends no emails, for fixing mistakes

### Step 6: Remove on-site payment
**Why:** Customers pay only through the emailed link. A second way to pay would create Stripe sessions the admin didn't send.
- 6.1 Delete `/api/quotes/checkout`, `/api/stripe/quote-checkout`, `PayNowButton`, the payment-cancelled page and their tests
- 6.2 Status lookup and account page: plain status text, a timeline, and the emailed payment link once it's been sent
- 6.3 3D printing page copy about paying

### Step 7: Accurate weight from the model
**Why:** The estimate used the outer box, so hollow and thin parts were overpriced, and shipping needs a real weight. The STL's real volume and surface area give a much better weight: outer walls print solid, and the inside is filled at the chosen infill.
- 7.1 Real volume and surface area from the triangles in `quote-analysis.ts`
- 7.2 `src/lib/print-estimate.ts`: pure pricing and weight maths with no Node imports, shared by the browser and the server
- 7.3 Server uses it on submit (the price that's stored)
- 7.4 Tests (solid cube, hollow box)

### Step 8: Live estimate in the browser
**Why:** "Get an instant estimate" should mean before submitting. Parsing the STL in the browser gives instant numbers without uploading up to 25 MB on every slider change.
- 8.1 Parse the STL in the browser when the file is picked, using the same maths as step 7
- 8.2 Price, weight, time and size update live with the options; the placeholder maths goes
- 8.3 The page passes the hourly rate and presets to the form

### Step 9: Shipping quotes
**Why:** Customers need the full price before they commit, and Deej needs the shipping amount ready when sending the quote. Australia Post's PAC API returns real prices from parcel size, weight and postcodes.
- 9.1 `src/lib/shipping.ts`: packaging (box around the part plus packaging weight), PAC lookup, pickup and local-delivery rules
- 9.2 Settings: origin postcode, local postcodes, local delivery fee, packaging allowance (optional, with defaults)
- 9.3 `GET /api/shipping/estimate` for the form
- 9.4 Form: postcode and delivery choice (pickup, local delivery, Parcel Post, Express Post) with live prices, stored on the quote
- 9.5 Admin settings fields for the new shipping settings
- 9.6 Tests with PAC mocked

### Step 10: Docs, checks, release
- 10.1 docs/ARCHITECTURE.md (order flow, Stripe, shipping), TODOs.md, `.env.example` (`AUSPOST_PAC_API_KEY`)
- 10.2 Lint, tests, build
- 10.3 PR to `dev`, check on staging
- 10.4 Deej: Stripe test keys and a test webhook on staging, a PAC API key, the Stripe webhook endpoint on production

## Original build order

1. Status history + one-button admin actions + an email for each status
2. "Send quote" creates the Stripe Payment Link; webhook marks it paid; remove the "Pay now" code
3. Shipping phase 1 (tracking number and email)
4. Customer timeline on the status page and account page
5. Shipping phases 2 and 3 once the account is set up

## Decisions needed (Deej)

- Stripe only, or PayPal too? (Recommendation: Stripe only)
- Shipping account: MyPost Business (phase 3 through ShipStation) or none for now?
- Should "Being reviewed" be automatic, or skipped entirely?

## References

<a id="ref-auspost-integrate"></a>Australia Post. (n.d.). *Integrate shipping and tracking APIs*. Retrieved September 27, 2026, from https://auspost.com.au/integrate-shipping-and-tracking-apis

<a id="ref-boldrails"></a>Bold Rails. (2026). *Merchant fees in Australia 2026: Costs after the surcharge ban*. https://boldrails.com/blog/best-payment-gateways-australia

<a id="ref-comkey-paypal"></a>ComKey Consulting. (2026). *Your guide to PayPal fees Australia for businesses in 2026*. https://comkeyconsulting.com.au/paypal-fees-australia/

<a id="ref-shipstation-mypost"></a>ShipStation. (n.d.). *Australia Post MyPost Business shipping and tracking integration*. Retrieved September 27, 2026, from https://www.shipstation.com/partners/mypost-business/

<a id="ref-starshipit-sendle"></a>Starshipit. (2026). *Best Sendle alternatives in 2026*. https://starshipit.com/blog-content/best-sendle-alternatives-2026

<a id="ref-stripe-pricing"></a>Stripe. (n.d.-a). *Pricing* (Australia). Retrieved September 27, 2026, from https://stripe.com/au/pricing

<a id="ref-stripe-paymentlink-create"></a>Stripe. (n.d.-b). *Create a payment link*. Retrieved September 27, 2026, from https://docs.stripe.com/api/payment-link/create
