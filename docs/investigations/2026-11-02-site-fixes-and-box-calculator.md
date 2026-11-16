# Site fixes and Box Calculator without a backend

**Date:** 2026-11-02
**Investigator:** Claude Code
**Status:** Done. Live on staging (#170) and production (#171). Dependabot alerts went from 21 to 2 (both medium: minimatch, glob).

## 1. What was asked

Fix the open items from the games page post-mortem, then find what would improve the site most and implement it.

## 2. What was checked

- The 21 open Dependabot alerts.
- The live Basic Bases game, for a real card image.
- The static export: every internal link and asset, titles, descriptions, canonicals, h1s and OG images on 30 pages.
- Every use of `NEXT_PUBLIC_API_URL`.
- What `dev` had that `main` did not.

## 3. What the evidence showed

- **Alerts:** all were in `yarn.lock`. Direct: next, storybook, vitest. Transitive: vite, markdown-it, fast-uri, undici, postcss-selector-parser.
- **Site structure:** no broken internal links or assets.
- **Biggest problem:** two listed tools did nothing for visitors. Box Shipping Calculator had an empty item list because its backend is gone. CNC Technical AI failed on every message. Both have write-ups pointing at them.
- **The calculator's packing already ran in the browser.** Only the item list needed a server.
- **`dev` vs `main`:** the file differences were only docs and dependency versions, so the 21 commits were safe to promote.

## 4. What was changed

- Upgraded next to 16.4.1, storybook to 10.6.5 and vitest to 4.1.12. Added yarn `resolutions` for the transitive packages, because `yarn upgrade` left them unchanged.
- Added `public/images/games/basic-bases.jpg`, a capture of the real game menu. The menu says "Baser Game", the game's original title.
- Box Calculator: items now live in `localStorage` through `itemStore.ts`, starting from sample parts, with a reset button. Removed all backend calls, the invoice import and the unused `PdfImport` component.
- CNC Technical AI: shows an offline page with a link to its write-up when no backend is set.
- Added canonicals to home, blog, posts, projects and wireless car. Made the page heading an h1 on the todo app, Basic Bases privacy and CNC pages.

## 5. What was deliberately not changed

- **Basic Bases rebuild:** still needs the source or a rebuild, plus Deej's review.
- **Sample item data is illustrative**, not real stock data.
- **The Dungeon Crawl playthrough and APK test** stay with Deej.
- **`resolutions` for postcss-selector-parser** apply to all its users. The upgrade crosses a major version for tools that asked for 6.x. Lint, tests and build pass, and these are build-time tools only.

## 6. Verification

- Types clean, lint 0 errors and 4 warnings, 118 of 118 tests, build clean.
- Audit of the export: no broken links; remaining issues are the 404 and retired stub pages, which need no canonical. The CNC h1 renders client side.
- Browser test on the export: added two items, calculated a result (1 Small Box), a delete survived reload, reset restored samples, the CNC offline page showed, the card image loaded, and there were no page errors.
- Review fixes on #170: saved items are validated, a new item is saved once, nanoid is 3.3.20. Tests, types, frozen install and build were rerun; lint and the local browser test were not.
- Staging and production: calculator returned a packing result, card image loaded (960 x 600), CNC offline page showed, the Geek Pride URL landed on Games, no console errors.

## 7. Open items

1. Find or rebuild Basic Bases.
2. Play Dungeon Crawl through and test the APK.
3. The Geek Pride redirects from #167 were only added to `render.yaml`. The services were created through the API, so they may not be applied live. The stub pages cover those URLs either way.
4. One medium Dependabot alert remains: minimatch below 11.0.1. Follow-up on 2026-11-03 removed glob, which was only a stale `resolutions` entry. minimatch 3.x comes from ESLint 9 and its plugins, and 10.x from typedoc and typescript-estree. These are lint and docs tools, not shipped to visitors. It was not forced to 11 because 3.x's default export differs, so wait for upstream or ESLint 10.

## 8. Commands to reproduce

```powershell
Set-Location 'C:\Users\deejp\repos\deejpotter'
npx yarn@1.22.22 install --frozen-lockfile --ignore-engines
npx eslint . --ext .ts,.tsx,.js,.jsx
npx vitest run
npx next build
gh api repos/Deejpotter/deejpotter/dependabot/alerts?state=open --jq 'length'
```
