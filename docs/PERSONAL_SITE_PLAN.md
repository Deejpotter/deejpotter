# deejpotter.com personal site plan

Last updated: 1 Oct 2026

deejpotter.com becomes a short personal landing page for your dev work and the home domain for your personal apps. All paid work — websites, fixes, CAD, 3D printing, engraving — moves to your business, **Lumendot** (lumendot.com.au). The quote, payment and order app now lives in the private `lumendot` repo; its site plan is `docs/LUMENDOT_SITE_PLAN.md` there.

## 1. Purpose

| | |
|---|---|
| **Is** | A calm, fast page that says who you are, shows what you've built, and links out |
| **For** | Developers, employers and recruiters, friends, people who found one of your repos or apps |
| **Is not** | A shop, a quote form, a services page or a blog you have to keep feeding |
| **Hire me** | One clear link to lumendot.com.au. No prices or packages here |

## 2. Pages

Keep it to one main page plus a few that must exist.

| Page | Content |
|---|---|
| **Home** (`/`) | Name and one line about you; a short intro (developer and maker in Victoria); project cards; links out; "Want something built? → Lumendot" |
| **Projects** (sections on the home page, or `/projects` if it gets long) | One card per project: name, 1–2 sentences, stack, status (live / in progress / archived), links (live app, repo, write-up) |
| **Project write-ups** (optional, `/projects/<name>`) | Only for projects worth a longer story: ESP32 wireless car, CNC technical AI, Day Planner. Move the existing write-ups here from the old blog |
| **Basic Bases privacy** (`/projects/games/basic-bases/basic-bases-privacy`) | **Must keep this exact URL** — it references Google Play Services, so a store listing may point at it |
| **Privacy** (`/privacy`) | Short: no forms, no accounts, what analytics (if any) collects |
| **404** | Friendly, links home |

### Projects to list

| Project | Where it runs | Link to |
|---|---|---|
| Day Planner | tasks.deejpotter.com (your instance) | Repo and docs site. The instance is personal; link it only if it gets a public demo |
| Grocery Visualiser | Self-hosted | Repo. Moves the old `/groceries` page and API out of the business app |
| Life Dashboard | life.deejpotter.com | Repo only — the instance shows your private data |
| Family Recipe App | — | Repo, when it's usable |
| ESP32 wireless car, CYD controllers, drawbot | — | Repos and write-ups |
| Games: Basic Bases, Geek Pride Day | — | Existing pages, moved as they are |
| Maker tools: 20-series and linear cut calculators, box shipping calculator, CNC calibration tool, CNC technical AI | Pages on this site | Keep as small tools here; check they don't clash with Maker Store employment terms before promoting them |
| This site | deejpotter.com | Repo |

### Links out

GitHub, LinkedIn, Lumendot (for work), email (as a mailto link, no form).

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
| Framework | Next.js static export (`output: "export"`) so existing page components and styles can be reused |
| Content | Project list in one typed data file; write-ups as Markdown |
| Hosting | A free static host (Cloudflare Pages or Netlify), replacing the Render services |
| Data, auth, payments | None |
| Analytics | Optional, privacy-friendly, or none |

## 5. What must keep working

Old URLs have links, QR codes, Google results and possibly Stripe emails pointing at them.

| Old URL | New home |
|---|---|
| `/projects/services/*` (website design, custom tools, 3D printing, requests, thank-you, CAD/CAM) | 301 to the matching lumendot.com.au page |
| `/contact`, `/account`, `/terms` | 301 to lumendot.com.au |
| `/projects/games/*`, `/projects/engineering/*`, `/projects/apps/*`, `/projects/tools/*` | Stay on deejpotter.com |
| `/blog/<slug>` | Business guides → 301 to lumendot.com.au; personal posts → a project write-up here |
| `/groceries` | 301 to the Grocery Visualiser repo or app page |
| `/admin/*`, `/sign-in`, `/sign-up` | Gone (410) or 301 to lumendot.com.au |

## 6. Order of work

This site must not lose the quote flow before Lumendot has it.

1. **Wait** until lumendot.com.au is live and tested (Lumendot site plan, launch order steps 1–3).
2. Build the new static site in this repo on a branch: home, projects, write-ups, the Basic Bases privacy page, privacy, 404.
3. Add the redirects in section 5.
4. Remove the app code this repo no longer needs: API routes, admin, account, auth, Stripe, R2, MongoDB, email, services pages, `/groceries`, and their dependencies and environment variables.
5. Point deejpotter.com at the static host; retire the Render services once any quote still in progress on the old domain is finished.
6. Check: every old URL in section 5 resolves, no private subdomain is mentioned anywhere, Lighthouse scores, mobile layout.
7. Decide what happens to the open `dev → main` pull request (homepage redesign, dependency updates), since that work now lives in the `lumendot` repo.

## 7. Open decisions

| Decision | Default until decided |
|---|---|
| Keep a blog here? | **For now (1 Oct 2026):** no blog, a write-up per project, and no effort to drive traffic here. Later, maybe a blog for personal posts. Old business posts redirect to Lumendot |
| Link the Day Planner instance? | No, until it has a public demo |
| Keep the maker calculators here or give them to Lumendot? | Here, until the Maker Store terms are checked |
| Keep branches like `feature/ecommerce-shop`, `deploy-ecommerce`, `feat/quote-order-flow`? | Delete once the app is gone; that history is preserved in the `lumendot` repo |
