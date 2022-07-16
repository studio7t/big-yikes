/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/test/setup-env.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup-tests.ts'],
};
