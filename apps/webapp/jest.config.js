//import nextJest from 'next/jest';
import nextJest from 'next/jest.js';

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],
  roots: ["<rootDir>/src/"],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: !true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "\\\\node_modules\\\\",
  //   "\\.pnp\\.[^\\\\]+$"
  // ],
  //transformIgnorePatterns: ['<rootDir>/node_modules/'],

  //"testMatch": ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  //"testRegex": "/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$"
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)