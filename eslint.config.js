import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'prefer-arrow-callback': 'warn',
      'func-style': ['warn', 'expression'],
      'no-restricted-syntax': [
        'error',
        {
          selector: "ClassDeclaration[superClass=null]:matches(:has(Identifier[name!='Error']))",
          message: 'Avoid classes in core code; prefer functions and hooks.',
        },
      ],
    },
  },
  {
    files: ['src/game/**/*.ts'],
    rules: {
      'no-class-assign': 'error',
    },
  },
])
