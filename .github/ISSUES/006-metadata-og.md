Title: Add OpenGraph / Twitter metadata and structured data for pages

Description:
Improve social previews and SEO by adding OpenGraph and Twitter card metadata to project and blog pages and adding structured data (JSON-LD) to blog posts.

Tasks:
- Add `openGraph` fields to page `metadata` exports (title, description, url, images).
- Add JSON-LD schema for blog posts (Article) in `src/app/blog/[slug]/page.tsx`.
- Add canonical URL generation and sitemap update step in CI if needed.

Owner: @dev
Priority: Medium

Acceptance criteria:
- Project pages and blog posts include `openGraph` metadata.
- Blog pages include JSON-LD structured data for Article.
- PR includes sample screenshots of social preview (if possible).

---

Status (2026-09-26): mostly done.

Done:
- Every public page has its own title and description. 18 pages use `generatePageMetadata()` (`src/app/metadata.ts`), which sets `openGraph` (title, description, url, image), Twitter card fields and a canonical URL.
- Blog posts set `openGraph` in `generateMetadata` (`src/app/blog/[slug]/page.tsx`).
- `sitemap.ts` and `robots.ts` exist; the quote board and 404 page are `noindex`.

Left:
- Blog posts have no JSON-LD `BlogPosting`/`Article` structured data yet.
- Every page shares `public/og-image.png`; per-page OG images (e.g. `opengraph-image.tsx`) would improve social previews.
- The sitemap's static route list is maintained by hand.
