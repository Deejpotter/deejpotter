# Payments and Shipping Setup — deejpotter.com

## Overview

The quote-to-order flow (`.github/ISSUES/007-quote-order-flow.md`) needs three outside services connected before it can take real orders:

- **Stripe secret key:** the admin "Send quote" button creates a Payment Link with `STRIPE_SECRET_KEY`. Customers pay on Stripe's hosted page, so no publishable (client-side) key is needed.
- **Stripe webhook:** Stripe calls `/api/webhooks/stripe` when a customer pays, and the site marks the quote paid. Webhooks are needed because the customer may never reach the site's thank-you page after paying ([Stripe, n.d.](#ref-stripe-fulfillment)). Without `STRIPE_WEBHOOK_SECRET` the webhook refuses every event, so quotes never move to Paid by themselves.
- **Australia Post PAC key:** the quote form's delivery prices come from Australia Post's Postage Assessment Calculator, and every request is meant to carry an API key in the `AUTH-KEY` header ([Australia Post, n.d.](#ref-auspost-pac)). `AUSPOST_PAC_API_KEY` holds it.

Staging uses Stripe **test** mode (a sandbox) so nothing there can take real money. Production uses **live** mode.

Keys and secrets are pasted in by Deej. Claude doesn't enter secrets into dashboards or forms.

**Status (2026-09-29):** all steps below are done on both services, and staging passed a full test order (quote #1003, paid with the test card and marked Paid by the webhook). Steps 2 and 3 now also need the `checkout.session.async_payment_succeeded` event added to both webhooks (see below).

## 1. Stripe test key → staging

1. Open https://dashboard.stripe.com/test/apikeys and check you're in the sandbox (dark "You are testing in a sandbox" bar at the top).
2. Next to **Secret key**, click **Reveal test key** and copy it (starts with `sk_test_`).
3. Open https://dashboard.render.com/web/srv-d89ak9ul51nc738837g0/env (`deejpotter-staging`).
4. Click **Edit** and paste the key over `STRIPE_SECRET_KEY`.
5. Don't save yet; the webhook secret in step 2 goes in the same edit.

## 2. Stripe test webhook → staging

1. Open https://dashboard.stripe.com/test/webhooks and click **Add destination** (older dashboards: **Add endpoint**).
2. Scope **Your account**, **API version**: the newest in the list (the account default can be years old).
3. Events: tick **`checkout.session.completed`** and **`checkout.session.async_payment_succeeded`**, then **Continue**. The second one matters for payment methods that settle later: their "completed" event arrives unpaid, and the async event is sent when the money actually arrives ([Stripe, n.d.](#ref-stripe-fulfillment)).
4. Destination type: **Webhook endpoint**, then **Continue**.
5. Endpoint URL: `https://staging.deejpotter.com/api/webhooks/stripe`, then **Create destination**.
6. On the endpoint's page, under **Signing secret**, click **Reveal** and copy it (`whsec_…`).
7. In the staging Render env, set `STRIPE_WEBHOOK_SECRET` to it and click **Save, rebuild, and deploy**.

**Adding the event to an existing webhook:** open the endpoint in https://dashboard.stripe.com/test/webhooks, choose **Edit destination** (or **Update details**), tick `checkout.session.async_payment_succeeded`, and save. The signing secret doesn't change.

## 3. Stripe live webhook → production

1. Open https://dashboard.stripe.com/acct_1GfGLODN3ptjenJp/workbench/webhooks (the live account; the sandbox bar must be gone).
2. Repeat step 2 with URL `https://deejpotter.com/api/webhooks/stripe` and both events.
3. Copy the signing secret (`whsec_…`).
4. Open https://dashboard.render.com/web/srv-d89ak9dckfvc738du5d0/env (`deejpotter`), click **Edit**, and set `STRIPE_WEBHOOK_SECRET`.
5. Leave production's `sk_live_` key as it is.

## 4. Australia Post PAC key → both services

1. Open https://developers.auspost.com.au/apis/pacpcs-registration.
2. Fill in your name, email, business name and website, accept the terms and submit. The key arrives by email.
3. In each service's Render env (links above), add `AUSPOST_PAC_API_KEY` and click **Save, rebuild, and deploy**.

## 5. Check it works (staging)

1. Upload an STL on https://staging.deejpotter.com/projects/services/3d-printing, enter a postcode and check the live price and delivery options appear.
2. Submit the quote, open https://staging.deejpotter.com/admin/3d-printing and press **Send quote + payment link**.
3. Open the payment link from the email and pay with Stripe's test card `4242 4242 4242 4242`, any future expiry and any CVC ([Stripe, n.d.](#ref-stripe-fulfillment)).
4. The quote should move to **Paid** by itself, and both the receipt and the admin "Paid" email should arrive.
5. If it stays on "Quote sent", check the webhook's delivery log in the Stripe dashboard and the Render logs for `[stripe webhook]`. A payment that doesn't match the quote's current link or total is left unpaid and emailed to Deej to check.

## Env var summary

| Variable | Staging | Production |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` | `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | test endpoint's `whsec_…` | live endpoint's `whsec_…` |
| `AUSPOST_PAC_API_KEY` | same key | same key |

`NEXT_PUBLIC_STRIPE_KEY` is no longer used (the on-site checkout was removed) and can be deleted from both services.

## References

<a id="ref-auspost-pac"></a>Australia Post. (n.d.). *Calculate domestic parcel postage cost*. Postage Assessment Calculator, Australia Post Developers. Retrieved September 29, 2026, from https://developers.auspost.com.au/apis/pac/tutorial/domestic-parcel

<a id="ref-stripe-fulfillment"></a>Stripe. (n.d.). *Fulfil orders*. Stripe Documentation. Retrieved September 29, 2026, from https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted
