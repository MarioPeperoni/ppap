import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePath } from 'vite';

const root = normalizePath(path.dirname(fileURLToPath(import.meta.url)));

/** Mirrors the tsconfig paths; Vite appends the separator when matching, so the entries carry none. */
export const alias = {
  '@': `${root}/src`,
  '~': root,
};
