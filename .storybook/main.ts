import type { StorybookConfig } from '@storybook/nextjs-vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "..\\public"
  ],
  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/image': resolve(__dirname, 'mocks', 'next-image.jsx'),
      'next/link': resolve(__dirname, 'mocks', 'next-link.jsx'),
    };
    return config;
  }
};
export default config;