module.exports = {
  globals: {
    'ENV_isAlpha': true,
    'ENV_isProduction': false,
    'ENV_isTest': true
  },
  moduleNameMapper: {
    '\\.(jpg|webp|svg|ttf|html)$': '<rootDir>/mocks/fileMock.js',
    '\\.(css)$': '<rootDir>/mocks/styleMock.js',
    '/renderer/render$': '<rootDir>/mocks/render.js',
    '/renderer/renderer\\.*': '<rootDir>/mocks/renderer.js'
  },
  testEnvironment: 'jsdom',
  verbose: true
}
