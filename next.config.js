const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    domains: ['www.gravatar.com'],
  },
}

module.exports = nextConfig
