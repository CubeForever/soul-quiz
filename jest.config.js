// Jest 配置 — 灵魂解码
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['./jest-setup.js'],

  // 处理 .ts 文件（ts-jest）
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },

  // 模块解析扩展名
  moduleFileExtensions: ['ts', 'js', 'json'],

  testPathIgnorePatterns: [
    '/node_modules/',
    'distribution_test',
  ],

  collectCoverageFrom: [
    'js/**/*.js',
    'js/**/*.ts',
    '!js/questions.js',
    '!js/utils.js',
  ],

  coverageReporters: ['text', 'lcov', 'html'],

  coverageThreshold: {
    global: {
      branches: 25,
      functions: 30,
      lines: 20,
      statements: 20,
    },
  },
};