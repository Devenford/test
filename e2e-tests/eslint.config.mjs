import js from '@eslint/js'
import globals from 'globals'
import playwright from 'eslint-plugin-playwright'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      playwright,
      '@stylistic/js': stylisticJs,
    },

    rules: {
      // Playwright rules
      ...playwright.configs['flat/recommended'].rules,

      // General JavaScript
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'no-console': 'off',

      // Style
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/object-curly-spacing': ['error', 'always'],
      '@stylistic/js/arrow-spacing': ['error', { before: true, after: true }],
    },
  },
]