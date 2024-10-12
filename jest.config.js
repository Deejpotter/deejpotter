module.exports = {
    // The preset property is used to specify which preset to use for Jest, which is ts-jest in our case since we're using TypeScript.
    preset: "ts-jest",
    // The testEnvironment property is used to specify which environment to use for testing. We want to use the jsdom environment, which is the default environment for Jest.
    testEnvironment: "jest-environment-jsdom",
    // The setupFilesAfterEnv property is used to specify which files to run before each test.
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    // The testPathIgnorePatterns property is used to specify which files Jest should ignore when running tests.
    // We want Jest to ignore the .next and node_modules directories because they contain files that we don't want to test and they can slow down the test suite.
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    // The transform property is used to specify which files Babel should process.
    // We want to process all JavaScript and TypeScript files, so we use a regular expression to match all files that end with .js, .jsx, .ts, or .tsx.
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["<rootDir>/node_modules/babel-jest", {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
        }],
    },
    // The moduleNameMapper property is used to specify how to handle CSS imports in our tests.
    // We want to mock CSS imports, so we use the identity-obj-proxy package to create a proxy object for CSS imports.
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mocks CSS imports
        "^@/(.*)$": "<rootDir>/src/$1", // Maps @ to src directory
    },

};