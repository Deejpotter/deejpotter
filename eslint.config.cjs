// Minimal flat ESLint config to keep CI lint step working.
// TODO: Replace with a complete config (extend Next.js recommended rules in flat format).
module.exports = [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    ignores: [".next/**", "out/**", "node_modules/**"],
    rules: {
      // No-op base rules for JS/JSX
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [".next/**", "out/**", "node_modules/**"],
    languageOptions: {
      parser: require.resolve("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      // No-op TypeScript rules, prefer enabling rules explicitly later
    },
  },
];