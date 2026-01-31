import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}'],
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
    reportsDirectory: 'coverage',
    exclude: [
      'node_modules',
      'dist',
      'public',
      'src/stories',
      'src/**/*.stories.*',
      'src/**/__tests__/**',
      'src/test/**',
      '.storybook/**',
    ],
    statements: 60,
    branches: 60,
    functions: 60,
    lines: 60,
  },
});
