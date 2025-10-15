module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.{1,2}\/.*)\\.js$': '$1'
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.json' }]
  },
  testMatch: ['**/tests/**/*.spec.ts'],
};
