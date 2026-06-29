// ESLint 扁平配置 — 灵魂解码项目
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/',
      '__tests__/distribution_test.js',
      '**/*.config.*',
      '**/tsconfig.*.json',
    ],
  },
  // 全局规则
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest,
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
      'no-var': 'warn',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-console': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-template': 'off',
      'no-restricted-globals': 'off',
    },
  },
  // TypeScript 规则（仅语法检查，类型检查由 tsc --noEmit 处理）
  {
    files: ['js/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: false,
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
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
      'no-var': 'warn',
      'no-undef': 'off',        // TypeScript 类型由 tsc 检查
      'no-unused-vars': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-console': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-template': 'off',
      'no-restricted-globals': 'off',
    },
  },
  // utils.ts 使用 var 兼容旧浏览器
  {
    files: ['js/utils.ts'],
    rules: {
      'no-var': 'off',
      'prefer-const': 'off',
    },
  },
];