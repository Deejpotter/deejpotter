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
