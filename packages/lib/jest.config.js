/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'src/test/tsconfig.json',
    },
  },
  transformIgnorePatterns: ['node_modules/(?!nanoid/.*)'],
};
