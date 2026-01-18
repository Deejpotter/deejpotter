import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Ensure fetch exists in the test environment
if (typeof globalThis.fetch === 'undefined') {
  // @ts-ignore
  globalThis.fetch = vi.fn();
}
