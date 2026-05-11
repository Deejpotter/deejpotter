import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/projects/services/3d-printing/requests"],
      },
    ],
    sitemap: "https://deejpotter.com/sitemap.xml",
    host: "https://deejpotter.com",
  };
}
