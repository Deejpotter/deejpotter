# deejpotter.com — repo overview

<!-- This is the repo's own README. The root readme.md is the GitHub profile
page (the repo shares the username), so repo details live here instead. It
sits in docs/ because GitHub shows .github/README.md in place of the root one,
which would replace the profile page. -->

Source code for [deejpotter.com](https://deejpotter.com): Deej Potter's personal site, a companion to the GitHub profile.

## What it does

- **Home page:** who Deej is, a grid of projects with their status, stack and links, and ways out to GitHub, LinkedIn and Lumendot (for paid work).
- **Browser tools and games:** cut calculators, box shipping calculator, CNC calibration tool, and Unity and pixel-art games.
- **Write-ups:** build notes for some of the projects.

There is no sign-in, contact form or database. The quote and order app that used to live here moved to the private `lumendot` repo on 30 Sept 2026.

## Stack

Next.js 16 static export (App Router), React 19, TypeScript, Tailwind CSS v4. Tested with Vitest and Playwright. Planned hosting: Cloudflare Pages (see [PERSONAL_SITE_PLAN.md](PERSONAL_SITE_PLAN.md)).

## Quick start

Node 24 and Yarn 1:

```bash
yarn install
yarn dev
```

## Docs

| Doc | For |
|---|---|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup, scripts, deploys, conventions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Decisions and why: static export, redirects, design system |
| [PERSONAL_SITE_PLAN.md](PERSONAL_SITE_PLAN.md) | What the site is for, and the order of the switch-over from the old app |
| [.github/TODOs.md](../.github/TODOs.md) | Current work and follow-ups |

## License

Personal work. Please get in touch before reusing any of it.
