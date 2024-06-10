'use strict';

/**
 * @typedef {import('@jest/types').Config.InitialOptions} JestConfig
 */

/**
 * @type {() => Promise<JestConfig>}
 */
module.exports = async () => ({
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/tests/integration'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.[^.]*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      // Tells ts-jest to transpile each file in isolation and skip type
      // checking. Makes test execution faster.
      { isolatedModules: true },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
});
