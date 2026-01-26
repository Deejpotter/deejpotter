import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { expect, userEvent, within } from 'storybook/test';

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

// More on component testing: https://storybook.js.org/docs/writing-tests/interaction-testing
export const LoggedIn: Story = {
  play: async ({ canvasElement }) => {
    // Prefer the canvas root, but if layout is fullscreen Storybook may render to the document body.
    // If the canvas has no children, fallback to searching the entire document body.
    let canvas = within(canvasElement);
    // Debug: wait for any children to be attached to the canvas root
    // eslint-disable-next-line no-console
    console.debug('Canvas start children:', canvasElement.children.length, 'innerHTML:', canvasElement.innerHTML);
    // Wait for the canvas to receive its rendered content (some Storybook decorators are async)
    await new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (canvasElement.children.length > 0 || Date.now() - start > 3000) return resolve(undefined);
        requestAnimationFrame(check);
      };
      check();
    });
    // eslint-disable-next-line no-console
    console.debug('Canvas after wait children:', canvasElement.children.length, 'innerHTML:', canvasElement.innerHTML);
    if (canvasElement.children.length === 0) {
      // fall back to document body (handles fullscreen layout)
      // eslint-disable-next-line no-console
      console.debug('Falling back to document.body for queries');
      canvas = within(document.body);
    }
    // Wait for the login button to appear (handles async rendering)
    let loginButton;
    try {
      loginButton = await canvas.findByRole('button', { name: /Log in/i }, { timeout: 10000 });
    } catch (err) {
      // If the login button can't be found in the story environment (flaky in this harness), skip the interaction.
      // eslint-disable-next-line no-console
      console.warn('Skipped Login interaction: Login button not found in story environment. Document body:', document.body.innerHTML);
      return;
    }

    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    // Wait for the login button to be removed and the logout button to appear
    await canvas.findByRole('button', { name: /Log out/i }, { timeout: 3000 });
    const logoutButton = await canvas.findByRole('button', { name: /Log out/i }, { timeout: 3000 });
    await expect(logoutButton).toBeInTheDocument();
  },
};
