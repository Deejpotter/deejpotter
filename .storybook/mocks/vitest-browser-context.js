export const server = {
  // Minimal no-op server mock used during unit tests
  beforeAll: async () => {},
  afterAll: async () => {},
  resetHandlers: () => {},
  listen: async () => ({ close: async () => {} }),
  // Storybook addon-vitest expects a `commands` object with getInitialGlobals
  commands: {
    getInitialGlobals: async () => ({})
  }
};
export const page = null;
export default { server, page };
