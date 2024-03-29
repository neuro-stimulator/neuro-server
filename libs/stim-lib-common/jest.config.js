module.exports = {
  name: 'stim-lib-common',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/stim-lib-common',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
};
