# deejpotter.com

Source code for [deejpotter.com](https://deejpotter.com): a Next.js site with a 3D printing quote-to-order system (live STL pricing, Australia Post delivery prices, Stripe Payment Links), an admin area, a blog and small web tools.

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, MongoDB Atlas, Clerk, Stripe, Resend, Cloudflare R2. Hosted on Render.

## Quick start

Node 24 and Yarn 1:

```bash
yarn install
cp .env.example .env
yarn dev
```

## Docs

- [DEVELOPMENT.md](DEVELOPMENT.md): setup, local database, scripts, conventions
- [ARCHITECTURE.md](ARCHITECTURE.md): decisions and why, env vars
- [PAYMENTS_SETUP.md](PAYMENTS_SETUP.md): Stripe and Australia Post keys
- [R2_SETUP.md](R2_SETUP.md): file storage

## License

Personal portfolio work. Please get in touch before reusing any of it.
