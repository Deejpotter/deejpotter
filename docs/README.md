# deejpotter.com — repo overview

<!-- This is the repo's own README. The root readme.md is the GitHub profile
page (the repo shares the username), so repo details live here instead. It
sits in docs/ because GitHub shows .github/README.md in place of the root one,
which would replace the profile page. -->

Source code for [deejpotter.com](https://deejpotter.com): Deej Potter's business site for websites, custom tools and 3D printing.

## What it does

- **3D printing quotes and orders:** customers upload an STL and see a live price from the model's real volume, plus Australia Post delivery prices for their postcode. Deej confirms the price and the site emails a Stripe Payment Link. Payment moves the order to "Paid" automatically, and every later step (start, ship with tracking, complete) emails the customer.
- **Admin area:** quote board with one button per order step, contact leads, and settings for materials, prices and shipping.
- **Contact form, blog (Markdown + RSS), portfolio pages and small tools** (cut calculators, CNC calibration, box shipping calculator).

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, MongoDB Atlas, Clerk, Stripe, Resend, Australia Post PAC API, Cloudflare R2, React Three Fiber. Tested with Vitest and Playwright. Hosted on Render: `dev` deploys to staging.deejpotter.com and `main` to deejpotter.com.

## Quick start

Node 24 and Yarn 1:

```bash
yarn install
cp .env.example .env
yarn dev
```

## Docs

| Doc | For |
|---|---|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup, local database, scripts, deploys, conventions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Decisions and why: hosting, databases, rendering, order flow, pricing, shipping, env vars |
| [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md) | Stripe keys and webhooks, Australia Post key |
| [R2_SETUP.md](R2_SETUP.md) | File storage for uploaded models |
| [.github/TODOs.md](../.github/TODOs.md) | Current work and follow-ups |
| [.github/ISSUES/](../.github/ISSUES/) | Larger plans |

## License

Personal work. Please get in touch before reusing any of it.
