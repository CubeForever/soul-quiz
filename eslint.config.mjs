// ESLint 扁平配置 — 灵魂解码项目
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/',
      '__tests__/distribution_test.js',
      '**/*.config.js',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
        // 灵魂解码全局命名空间
        SoulUtils: 'readonly',
        SoulScoring: 'readonly',
        SoulReport: 'readonly',
        SoulWebhook: 'readonly',
        SoulShare: 'readonly',
        SoulUI: 'readonly',
        SOUL_QUESTIONS: 'readonly',
        SOUL_DIMENSIONS: 'readonly',
        html2canvas: 'readonly',
      },
    },
    rules: {
      // 宽松规则：项目中允许的惯例
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-console': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-template': 'off',
      'no-restricted-globals': 'off',
    },
  },
  // utils.js 使用 var 兼容旧浏览器
  {
    files: ['js/utils.js'],
    rules: {
      'no-var': 'off',
      'prefer-const': 'off',
    },
  },
];