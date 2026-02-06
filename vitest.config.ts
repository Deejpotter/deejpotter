/**
 * Vitest configuration for the deejpotter project.
 *
 * Key choices:
 * - jsdom environment: lets us test React components that use DOM APIs
 *   without a real browser.
 * - resolve.alias "@/" → "./src/": mirrors the tsconfig "paths" so imports
 *   like `@/contexts/NavbarContext` work identically in tests and app code.
 * - setupFiles: loads @testing-library/jest-dom matchers (toBeInTheDocument,
 *   toHaveClass, etc.) before every test file.
 */
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
});
