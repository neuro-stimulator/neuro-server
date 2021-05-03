module.exports = {
  name: 'server',
  rootDir: '../../',
  testMatch: ['<rootDir>/apps/server/test/src/**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['^.+\\.js$'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  coverageReporters: ['json', 'lcov'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/apps/server',

  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/node_modules/**',
    '!**/{*.module,index,main,*.spec,*.jest}.ts'
  ],

  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/coverage',
    '<rootDir>/coverage-e2e',
    '<rootDir>/e2e',
  ],

  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/coverage',
    '<rootDir>/coverage-e2e',
    '<rootDir>/apps/server/src/app/database',
    '<rootDir>/apps/server/src/app/middleware',
    '<rootDir>/apps/server/src/environments',
    '<rootDir>/apps/server/src/app/migrations',
    '<rootDir>/apps/server/test/helpers',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/apps/server/tsconfig.spec.json'
    }
  },
  setupFilesAfterEnv: ['<rootDir>/apps/server/test/jest/call_setup.js'],
  moduleDirectories: [
    "node_modules",
    "libs"
  ],
  moduleNameMapper: {
    '@diplomka-backend/(.*)': '<rootDir>/libs/$1/src'
  }
};
