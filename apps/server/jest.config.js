module.exports = {
  name: 'server',
  preset: '../../jest.config.js',
  testMatch: ['<rootDir>/**/*.e2e-spec.ts'],
  coverageDirectory: '../../coverage/apps/server',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
};
