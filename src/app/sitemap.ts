import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/blog",
  "/blog/rss.xml",
  "/projects/apps",
  "/projects/engineering",
  "/projects/games",
  "/projects/services",
  "/projects/tools",
  "/projects/websites",
  "/projects/apps/todo-app",
  "/projects/engineering/wireless-car",
  "/projects/games/basic-bases",
  "/projects/games/basic-bases/basic-bases-privacy",
  "/projects/services/3d-printing",
  "/projects/services/custom-tools",
  "/projects/services/website-design",
  "/projects/services/website-redesign",
  "/projects/tools/20-series-cut-calculator",
  "/projects/tools/box-shipping-calculator",
  "/projects/tools/cnc-calibration-tool",
  "/projects/tools/cnc-technical-ai",
  "/projects/tools/linear-cut-calculator",
  "/projects/websites/deejpotter",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://deejpotter.com";
  const now = new Date();
  const blogPosts = getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : route === "/blog" ? "weekly" : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/contact"
          ? 0.9
          : route === "/projects/services"
            ? 0.9
            : route.startsWith("/projects/services/")
              ? 0.85
              : route === "/blog"
                ? 0.85
                : route.startsWith("/projects/websites")
                  ? 0.85
                  : route === "/blog/rss.xml"
                    ? 0.4
                    : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticEntries, ...blogEntries];
}
