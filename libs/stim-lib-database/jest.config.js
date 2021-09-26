module.exports = {
  name: 'stim-lib-database',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/stim-lib-database',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' }, },
};
