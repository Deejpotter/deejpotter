# deejpotter.com personal site plan

Last updated: 2 Oct 2026

deejpotter.com becomes a short personal landing page for your dev work and the home domain for your personal apps. All paid work — websites, fixes, CAD, 3D printing, engraving — moves to your business, **Lumendot** (lumendot.com). The quote, payment and order app now lives in the private `lumendot` repo; its site plan is `docs/LUMENDOT_SITE_PLAN.md` there.

## 1. Purpose

| | |
|---|---|
| **Is** | A calm, fast page that says who you are, shows what you've built, and links out |
| **For** | Developers, employers and recruiters, friends, people who found one of your repos or apps |
| **Is not** | A shop, a quote form, a services page, a contact form or a blog you have to keep feeding |
| **Contact** | No form and no email address. Work enquiries go to lumendot.com (its contact form and `/admin/leads` live there); everything else goes to GitHub |

## 2. Pages

Keep it to one main page plus a few that must exist.

| Page | Content |
|---|---|
| **Home** (`/`) | Name and one line about you; a short intro (developer and maker in Victoria); project cards; links out; "Want something built? → Lumendot" |
| **Projects** (sections on the home page, or `/projects` if it gets long) | One card per project: name, 1–2 sentences, stack, status (live / in progress / archived), links (live app, repo, write-up) |
| **Project write-ups** (optional, `/projects/<name>`) | Only for projects worth a longer story: ESP32 wireless car, CNC technical AI, Day Planner. Move the existing write-ups here from the old blog |
| **Basic Bases privacy** (`/projects/games/basic-bases/basic-bases-privacy`) | **Must keep this exact URL** — it references Google Play Services, so a store listing may point at it |
| **Privacy** (`/privacy`) | Short: no forms, no accounts, no login, what analytics (if any) collects |
| **404** | Friendly, links home |

### Projects to list

| Project | Where it runs | Link to |
|---|---|---|
| Day Planner | tasks.deejpotter.com (your instance) | Repo and docs site. The instance is personal; link it only if it gets a public demo |
| Grocery Visualiser | Self-hosted | Repo. Replaces the old `/groceries` page (see section 5) |
| Life Dashboard | life.deejpotter.com | Repo only — the instance shows your private data |
| Family Recipe App | — | Repo, when it's usable |
| ESP32 wireless car, CYD controllers, drawbot | — | Repos and write-ups |
| Games: Basic Bases, Geek Pride Day | — | Existing pages, moved as they are |
| Maker tools: 20-series and linear cut calculators, box shipping calculator, CNC calibration tool, CNC technical AI | Pages on this site | Keep as small tools here; check they don't clash with Maker Store employment terms before promoting them |
| This site | deejpotter.com | Repo |

### Links out

GitHub, LinkedIn and Lumendot (for work). No email link: contact goes through Lumendot or GitHub (decided 1 Oct 2026).

## 3. Subdomains

deejpotter.com is the parent domain for personal apps. Each app is its own repo and deployment; this site only links to them.

| Type | Examples | On the landing page? |
|---|---|---|
| **Public** — built for others to use or view | Day Planner demo or docs, games, tools | Yes, as a project card |
| **Personal but safe to mention** | Day Planner and Grocery Visualiser instances | Mention the project, link the repo, not the instance |
| **Private** — your own data or services | vault, finance, food, life, krasus, roms | **Never listed**, not in the sitemap, behind a login or Cloudflare Access |

Rules:
- Never put a private subdomain in page copy, the sitemap, `robots.txt` or public repos' READMEs where avoidable. Listing them advertises targets.
- Business work never runs on a deejpotter.com subdomain; client sites and client tools go under Lumendot.
- Add a subdomain to the landing page only when it has a public page worth visiting.

## 4. Stack

The app's database, auth, Stripe, R2, Resend and admin all go with Lumendot. What's left is static.

| | Choice |
|---|---|
| Framework | **Next.js static export** (`output: "export"`). Decided 1 Oct 2026: this is a dev site to show off, so JavaScript is wanted, and the existing motion, wireframe hero and tools carry over as they are. Astro was considered for being lighter and dropped for that reason |
| Content | Project list in `src/content/projects.ts`; outbound links in `src/content/links.ts`; write-ups stay at `/blog/<slug>` |
| Hosting | Render static site (free), replacing the two Render web services. `public/_redirects` keeps Cloudflare Pages or Netlify open as alternatives (section 6, phase A) |
| Data, auth, payments | None. Nothing on the site needs a login: admin, account and leads go to Lumendot, groceries to the Grocery Visualiser |
| Analytics | Optional, privacy-friendly, or none |

## 5. What must keep working

Old URLs have links, QR codes, Google results and possibly Stripe emails pointing at them.

| Old URL | New home |
|---|---|
| `/projects/services/*` (website design, custom tools, 3D printing, requests, thank-you, CAD/CAM) | 301 to the matching lumendot.com page |
| `/contact`, `/account`, `/terms` | 301 to lumendot.com |
| `/projects`, `/projects/games/*`, `/projects/engineering/*`, `/projects/apps/*`, `/projects/tools/*`, `/projects/websites/*` | Stay on deejpotter.com. lumendot.com redirects these paths here (since 1 Oct 2026), so keep them working or redirect onward |
| `/blog/<slug>` | Business guides → 301 to lumendot.com; personal posts → a project write-up here |
| `/blog/box-shipping-calculator`, `/blog/cnc-technical-ai`, `/blog/esp32-wireless-car`, `/blog/portfolio-migration`, `/blog/openclaw-android-pairing-request-churn` | lumendot.com redirects these five here (since 1 Oct 2026). Keep each URL, or 301 it to its project write-up |
| `/groceries` | 301 to the Grocery Visualiser repo. That app already covers it: it imports the Woolworths order-history CSV, and its refactor plan dropped PDF import on purpose, so this site's PDF parser is not ported. Export the `grocery_orders` collection first if the old orders are wanted |
| `/admin/*` (including `/admin/leads`), `/sign-in`, `/sign-up` | 301 to lumendot.com. The site has no login at all |

## 6. Switch-over plan (2 Oct 2026)

This site must not lose the quote flow before Lumendot has it.

### Status

**Phases A to C done on 2 Oct 2026.** Lumendot runs on lumendot.com while the ABN for lumendot.com.au is pending, so every redirect points there. deejpotter.com, www and staging.deejpotter.com now serve the static site from two Render static sites (staging from `dev`, production from `main`); see `ARCHITECTURE.md`, "Hosting". Phase D is what's left.

### Where things stood before the switch

| | State on 2 Oct 2026 |
|---|---|
| New static site | Built on `feat/personal-site`, draft PR #144 into `dev`. Lint, tests and build pass. Includes `render.yaml` (Render static site) and `public/_redirects` with the same redirects to matching Lumendot pages |
| deejpotter.com | Still the old business app: Render web service `deejpotter` (Starter) from `main`, and `deejpotter-staging` (free) from `dev`. DNS is on Cloudflare |
| Lumendot | Site built and running on Render (`lumendot`, `lumendot-staging`), reachable at lumendot.onrender.com |
| lumendot.com | **Not registered.** It needs the ABN reactivated first (Lumendot `TODO.md`). Stripe webhooks, Payment Links, Resend and the end-to-end test on the new domain are also still open there |
| Open PR #143 (`dev` into `main`) | Homepage redesign and dependency updates. Its commits are already in `dev`, in #144 and in the `lumendot` repo |

### Phase A: get the new site ready (no effect on the live site)

1. Create the Render static site from `render.yaml` with no custom domain, building `feat/personal-site` for now (the Blueprint says `main`; switch it at cut-over).
2. Check it on its onrender.com address:
   - every page, the Basic Bases privacy page at its exact URL, and both games actually load (the Unity build uses `.unityweb` files, which may need headers on a static host)
   - every redirect in section 5, especially the overlapping ones (`/projects/services/3d-printing/*` versus `/projects/services/*`): Render's docs don't say which rule wins when two match
   - mobile layout and Lighthouse
3. Fix what fails; Deej reviews the copy and the project list on PR #144.
4. Hosting decision: Render static site (free, same dashboard as everything else, Blueprint already written) instead of Cloudflare Pages. `public/_redirects` stays so the site can move to Cloudflare Pages or Netlify without changes.

### Phase B: the gate (Lumendot side)

Cut over only when all of these are true:

- lumendot.com resolves with a valid certificate, and every redirect target in section 5 answers there
- the quote flow has been tested end to end on it (quote, Payment Link, webhook, emails, status page)
- the production Stripe webhook and new Payment Links point at Lumendot, not deejpotter.com
- no quote still depends on a deejpotter.com page that won't redirect (Payment Links already sent redirect to `/projects/services/3d-printing/...`, which is covered)

### Phase C: cut-over (one sitting, about 30 minutes)

1. Turn off auto-deploy on `deejpotter` and suspend `deejpotter-staging`, so merging the static site doesn't make them try to run it as a Node server.
2. Merge #144 into `dev` and close #143. Then merge `dev` into `main` with a merge commit.
3. Point the static site at `main`.
4. Move the custom domains: remove `deejpotter.com` and `www.deejpotter.com` from `deejpotter`, add them to the static site, and update the Cloudflare DNS records it asks for (DNS only, not proxied, while Render issues the certificate). Expect a few minutes without a certificate.
5. Remove `staging.deejpotter.com` (DNS record and Render domain). The static site uses pull request previews instead of a staging site.
6. Check live: every page, every redirect, the certificate, `www` going to the apex, and the profile `readme.md` on GitHub.

### Phase D: clean up (about two weeks later, once no quote needs the old app)

1. Delete the `deejpotter` and `deejpotter-staging` Render services (saves the Starter plan).
2. Remove the old Stripe webhook endpoint on deejpotter.com, and the Clerk production instance and its webhook (Lumendot uses Better Auth now).
3. Data: Lumendot decides whether it keeps the shared `deejpotter` database. Export `grocery_orders` first if the old orders are wanted.
4. Repo: delete the old branches, update the GitHub repo description, move or delete the business prompts in `.github/agents` and `.github/prompts`.
5. Cloudflare DNS: remove records only the old app used. Keep anything Resend or other personal subdomains still need.

## 7. Open decisions

| Decision | Default until decided |
|---|---|
| Keep a blog here? | **For now (1 Oct 2026):** no blog, a write-up per project, and no effort to drive traffic here. Later, maybe a blog for personal posts. Old business posts redirect to Lumendot |
| Link the Day Planner instance? | No, until it has a public demo |
| Keep the maker calculators here or give them to Lumendot? | Here, until the Maker Store terms are checked |
| Keep branches like `feature/ecommerce-shop`, `deploy-ecommerce`, `feat/quote-order-flow`? | Delete once the app is gone; that history is preserved in the `lumendot` repo |
