const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  // The site has no server code left (no API routes, auth or database), so it
  // builds to plain files in out/ that any static host can serve.
  output: "export",
  // Folder-style URLs (/about/index.html) so every static host serves
  // /about without needing extension rewriting.
  trailingSlash: true,
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src/styles"),
      path.join(__dirname, "node_modules", "bootstrap", "scss"),
      path.join(__dirname, "node_modules", "bootstrap", "scss", "mixins"),
    ],
  },
  // Image optimisation needs a server; with a static export images are served
  // as they are.
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  // Redirects can't run in a static export. They live in public/_redirects,
  // which the static host reads.
};

module.exports = nextConfig;
