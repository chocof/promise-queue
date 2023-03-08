/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // Increase if more tests are added
  testTimeout: 20000,

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  moduleFileExtensions: ["js"],

  // The root directory that Jest should scan for tests and modules within
  rootDir: "./test",

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 10,

  // The glob patterns Jest uses to detect test files
  testMatch: ["./test.js"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"]
};
