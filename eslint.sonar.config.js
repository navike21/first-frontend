import tseslint from 'typescript-eslint'
import sonarjs from 'eslint-plugin-sonarjs'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

// Standalone SonarJS scan, kept separate from the main lint gate so it can be
// run on demand (`pnpm lint:sonar`) to surface code smells, cognitive
// complexity and duplications without blocking everyday development.
export default defineConfig([
  globalIgnores([
    'dist',
    'dist-ssr',
    'coverage',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.stories.tsx',
  ]),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [sonarjs.configs.recommended],
    // Registered (not enabled) so inline `eslint-disable react-hooks/*`
    // directives in the source resolve instead of erroring as unknown rules.
    plugins: { 'react-hooks': reactHooks },
    // Those directives are "unused" here (react-hooks rules aren't enabled in
    // this sonar-only config); the main lint config is what consumes them.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Only false-fires on legitimate UI/i18n "password" label & placeholder
      // strings (login forms, translations) — never actual secrets here.
      'sonarjs/no-hardcoded-passwords': 'off',
      // Already enforced by the main lint config (typescript-eslint).
      'sonarjs/no-unused-vars': 'off',
    },
  },
])
