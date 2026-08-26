import { fileURLToPath } from 'node:url';

/** Mirrors the tsconfig paths; Vite resolves a trailing slash as a prefix, so `@tailwindcss` is safe. */
export const alias = {
  '@/': fileURLToPath(new URL('./src/', import.meta.url)),
  '~/': fileURLToPath(new URL('./', import.meta.url)),
};
