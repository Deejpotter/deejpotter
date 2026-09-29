Title: Quote to order flow: automatic statuses, Stripe payment links, shipping

Status: Planned (2026-09-27), waiting on decisions below
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

## Build order

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
