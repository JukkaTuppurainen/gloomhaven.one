module.exports = {
  globals: {
    'ENV_isAlpha': true,
    'ENV_isProduction': false,
    'ENV_isTest': true
  },
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '\\.(jpg|webp|svg|ttf|html)$': '<rootDir>/mocks/fileMock.js',
    '\\.(css)$': '<rootDir>/mocks/styleMock.js',
    '/renderer.*': '<rootDir>/mocks/renderer.js'
  }
}
