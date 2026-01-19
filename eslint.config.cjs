// Minimal flat ESLint config to keep CI lint step working.
// TODO: Replace with a complete config (extend Next.js recommended rules in flat format).
module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
    },
    ignores: [".next/**", "out/**", "node_modules/**"],
    rules: {
      // No-op base rules; enable repo-specific rules later
    },
  },
];