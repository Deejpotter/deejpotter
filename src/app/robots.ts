import { MetadataRoute } from "next";

// Built once into a file; a static export has no server to generate it per request.
export const dynamic = "force-static";

// Everything on the static site is public, so there is nothing to hide from
// crawlers. The old /admin and quote paths now live on Lumendot.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://deejpotter.com/sitemap.xml",
    host: "https://deejpotter.com",
  };
}
