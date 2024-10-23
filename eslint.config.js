import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react-refresh/only-export-components': 'off',
    semi: [2, 'never'],

    indent: ['error', 2, {
      SwitchCase: 1
    }],

    'object-curly-spacing': ['error', 'always'],

    'key-spacing': ['error', {
      beforeColon: false,
      afterColon: true
    }],

    'comma-dangle': ['error', 'never'],

    'comma-spacing': ['error', {
      before: false,
      after: true
    }],

    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxEOF: 0
    }],

    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    'no-trailing-spaces': 'error',

    'space-infix-ops': ['error', {
      int32Hint: false
    }]
    },
  },
)
