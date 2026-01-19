// Use Next's shared config by including it directly in the flat config array
// See: https://eslint.org/docs/latest/use/configure/migration-guide#predefined-and-shareable-configs
const nextConfig = require("eslint-config-next");

module.exports = [
  nextConfig,
  {
    ignores: [".next/**", "out/**", "node_modules/**"],
    rules: {
      // Repo-specific rule overrides
    },
  },
];