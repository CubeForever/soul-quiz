// Jest 配置 — 灵魂解码
module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',

  // 每个测试文件运行前执行的 setup 文件
  setupFiles: ['./jest-setup.js'],

  // 忽略的路径模式
  testPathIgnorePatterns: [
    '/node_modules/',
    'distribution_test',
  ],

  // 覆盖率收集
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/questions.js',    // 数据文件，不包含业务逻辑
    '!js/utils.js',        // 工具函数，手动测试
  ],

  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],

  // 覆盖率阈值（目标值，可逐步提升）
  // 当前：核心模块( scoring.js 96%, report.js 95% )，UI/Webhook 需补充集成测试
  // 短期目标：全局 > 60%，中期目标：全局 > 80%
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 30,
      lines: 20,
      statements: 20,
    },
  },
};