const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(__dirname, "src/styles"),
      path.join(__dirname, "node_modules", "bootstrap", "scss"),
      path.join(__dirname, "node_modules", "bootstrap", "scss", "mixins"),
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  // Add MDX support for .md and .mdx files
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

module.exports = nextConfig;
