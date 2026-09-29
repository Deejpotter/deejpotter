# Payments and Shipping Setup — deejpotter.com

## Overview

The quote-to-order flow (`.github/ISSUES/007-quote-order-flow.md`) needs three outside services connected before it can take real orders:

- **Stripe keys:** the admin "Send quote" button creates a Payment Link with `STRIPE_SECRET_KEY`.
- **Stripe webhook:** Stripe calls `/api/webhooks/stripe` when a customer pays, and the site marks the quote paid. Without `STRIPE_WEBHOOK_SECRET` the webhook refuses every event, so quotes never move to Paid by themselves.
- **Australia Post PAC key:** the quote form's delivery prices come from Australia Post. `AUSPOST_PAC_API_KEY` is the key for that.

Staging uses Stripe **test** mode so nothing there can take real money. Production uses **live** mode.

Keys and secrets are pasted in by Deej. Claude doesn't enter secrets into dashboards or forms.

## 1. Stripe test keys → staging

1. Open https://dashboard.stripe.com/test/apikeys and check the **Test mode** toggle at the top is on.
2. Next to **Secret key**, click **Reveal test key** and copy it (starts with `sk_test_`).
3. Open https://dashboard.render.com/web/srv-d89ak9ul51nc738837g0/env (`deejpotter-staging`).
4. Click **Edit** and paste the key over `STRIPE_SECRET_KEY`.
5. Copy the **Publishable key** (`pk_test_…`) and paste it over `NEXT_PUBLIC_STRIPE_KEY`.
6. Don't save yet; the webhook secret in step 2 goes in the same edit.

## 2. Stripe test webhook → staging

1. Open https://dashboard.stripe.com/test/webhooks and click **Add destination** (older dashboards: **Add endpoint**).
2. Events: tick **`checkout.session.completed`**, then **Continue**.
3. Destination type: **Webhook endpoint**, then **Continue**.
4. Endpoint URL: `https://staging.deejpotter.com/api/webhooks/stripe`, then **Create destination**.
5. On the endpoint's page, under **Signing secret**, click **Reveal** and copy it (`whsec_…`).
6. In the staging Render env, set `STRIPE_WEBHOOK_SECRET` to it.
7. Click **Save, rebuild, and deploy**.

## 3. Stripe live webhook → production

1. Open https://dashboard.stripe.com/webhooks with **Test mode off**.
2. Repeat step 2 with URL `https://deejpotter.com/api/webhooks/stripe` and event `checkout.session.completed`.
3. Copy the signing secret (`whsec_…`).
4. Open https://dashboard.render.com/web/srv-d89ak9dckfvc738du5d0/env (`deejpotter`), click **Edit**, and set `STRIPE_WEBHOOK_SECRET`.
5. Leave production's `sk_live_` / `pk_live_` keys as they are.
6. If you're doing step 4 now, don't save yet, so production only redeploys once.

## 4. Australia Post PAC key → both services

1. Open https://developers.auspost.com.au/apis/pacpcs-registration.
2. Fill in your details, accept the terms and submit. The key arrives by email.
3. In the production Render env, add `AUSPOST_PAC_API_KEY` and click **Save, rebuild, and deploy**.
4. Open https://dashboard.render.com/web/srv-d89ak9ul51nc738837g0/env, add the same variable, and **Save, rebuild, and deploy**.

## 5. Check it works (staging)

1. Upload an STL on https://staging.deejpotter.com/projects/services/3d-printing, enter a postcode and check the live price and delivery options appear.
2. Submit the quote, open https://staging.deejpotter.com/admin/3d-printing and press **Send quote + payment link**.
3. Open the payment link from the email and pay with Stripe's test card `4242 4242 4242 4242` (any future expiry, any CVC).
4. The quote should move to **Paid** by itself, and both the receipt and the admin "Paid" email should arrive.
5. If it stays on "Quote sent", check the webhook's delivery log in the Stripe dashboard and the Render logs for `[stripe webhook]`.

## Env var summary

| Variable | Staging | Production |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` | `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_KEY` | `pk_test_…` | `pk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | test endpoint's `whsec_…` | live endpoint's `whsec_…` |
| `AUSPOST_PAC_API_KEY` | same key | same key |
