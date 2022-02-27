const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,

  coverageReporters: ['json', 'lcov'],
  collectCoverage: true,

  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/node_modules/**',
    '!**/{*.module,index,main,*.spec,*.jest}.ts'
  ],

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
