import { MetadataRoute } from "next";

// Built once into a file; a static export has no server to generate it per request.
export const dynamic = "force-static";
import { getAllPosts } from "@/lib/blog";

// Pages that exist on the static site. Old business URLs (services, contact,
// terms) are redirects to Lumendot now, so they stay out of the sitemap.
const staticRoutes = [
  "",
  "/about",
  "/privacy",
  "/blog",
  "/blog/rss.xml",
  "/projects",
  "/projects/apps",
  "/projects/apps/todo-app",
  "/projects/engineering",
  "/projects/engineering/wireless-car",
  "/projects/games",
  "/projects/games/basic-bases",
  "/projects/games/basic-bases/basic-bases-privacy",
  "/projects/games/geek-pride-day",
  "/projects/tools",
  "/projects/tools/20-series-cut-calculator",
  "/projects/tools/box-shipping-calculator",
  "/projects/tools/cnc-calibration-tool",
  "/projects/tools/cnc-technical-ai",
  "/projects/tools/linear-cut-calculator",
  "/projects/websites",
  "/projects/websites/deejpotter",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://deejpotter.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/blog/rss.xml" ? 0.4 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
