module.exports = {
    // The preset property allows us to specify which preset to use for Jest, which is ts-jest in our case since we're using TypeScript.
    preset: 'ts-jest',
    // The testEnvironment property allows us to specify which environment to use for testing. We want to use the jsdom environment, which is the default environment for Jest.
    testEnvironment: 'jsdom',  
    // The setupFilesAfterEnv property allows us to specify which files to run before each test.
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // The testPathIgnorePatterns property allows us to specify which files Jest should ignore when running tests.
    // We want Jest to ignore the .next and node_modules directories, so we add them to the testPathIgnorePatterns array.
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    // The transform property allows us to specify which files Babel should process.
    // We want to process all JavaScript and TypeScript files, so we use a regular expression to match all files that end with .js, .jsx, .ts, or .tsx.
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['<rootDir>/node_modules/babel-jest', {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
        }],
    },
    // The moduleNameMapper property allows us to specify how to handle CSS imports in our tests.
    // We want to mock CSS imports, so we use the identity-obj-proxy package to create a proxy object for CSS imports.
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};