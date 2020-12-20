module.exports = {
  name: 'server',
  rootDir: '../../',
  preset: './jest.config.js',
  testMatch: ['**/*.e2e-spec.ts'],
  coverageDirectory: './coverage/apps/server',
  coveragePathIgnorePatterns: [
    'src/app/database',
    'src/app/middleware',
    'src/environments',
    'test/helpers'
  ],
  globals: { 'ts-jest': { tsconfig: 'tsconfig.spec.json' } },
};
