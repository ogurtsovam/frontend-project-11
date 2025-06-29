import globals from 'globals'
import path from 'path'
import { fileURLToPath } from 'url'
import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    ignores: ['dist/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...stylistic.configs.customize.rules,
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      'no-underscore-dangle': [
        'error',
        {
          allow: ['__filename', '__dirname'],
        },
      ],
      'import/extensions': [
        'error',
        {
          js: 'always',
        },
      ],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
]