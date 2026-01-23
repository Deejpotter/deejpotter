// Next.js flat ESLint config: extend the Next.js recommended rules and add repo overrides.
// This uses `eslint-config-next` as the baseline and applies a few project-specific overrides.
const nextConfig = require('eslint-config-next');

module.exports = [
  // spread the Next.js-provided flat config entries first
  ...(Array.isArray(nextConfig) ? nextConfig : [nextConfig]),
  // project-specific overrides
  {
    ignores: ['node_modules/**', '.next/**', 'public/**'],
    plugins: {
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      // Allow prop spreading in JSX where it's intentionally used in existing components
      'react/jsx-props-no-spreading': 'off',
      // Lower severity of a few strict/react-compiler rules during migration
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/refs': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];