module.exports = {
  name: 'server',
  preset: '../../jest.config.js',
  testMatch: ['**/*.e2e-spec.ts'],
  coverageDirectory: '../../coverage/apps/server',
  coveragePathIgnorePatterns: [
    'src/app/database',
    'src/app/middleware',
    'src/environments',
    'test/helpers'
  ],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
};
