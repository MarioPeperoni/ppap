import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const PURE_LAYERS = ['src/core/**/*.ts', 'src/constants/**/*.ts', 'src/validation/**/*.ts'];

/**
 * @param {string[]} groups
 * @param {string} message
 */
function forbid(groups, message) {
  const patterns = groups.map((group) => ({ group: [group], message }));

  return { 'no-restricted-imports': ['error', { patterns }] };
}

export default defineConfig(
  { ignores: ['.vite/**', 'out/**', 'dist/**', 'node_modules/**'] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['eslint.config.mjs'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: PURE_LAYERS,
    rules: forbid(
      ['electron', 'react', 'zustand', '@/main/**', '@/preload/**', '@/renderer/**'],
      'The pure layers must not depend on a process, a framework or the UI.',
    ),
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    rules: forbid(
      ['electron', '@/main/**', '@/preload/**'],
      'The renderer reaches main only through the window.ppap bridge.',
    ),
  },
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts'],
    rules: forbid(
      ['react', 'react-dom', '@/renderer/**'],
      'Main and preload must not import renderer code.',
    ),
  },
  {
    files: ['src/renderer/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['src/**/__tests__/**/*.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
);
