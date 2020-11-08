module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverageFrom: ['{src,libs}/**/*.ts', '!**/node_modules/**'],
  coverageReporters: ['json', 'lcov'],
  collectCoverage: true,

  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/coverage',
    '<rootDir>/coverage-e2e',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/coverage',
    '<rootDir>/coverage-e2e',
    '<rootDir>/e2e',
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
