import { defineConfig } from 'vite';
import { alias } from './vite.alias.mjs';

export default defineConfig({
  resolve: { alias },
  build: { rollupOptions: { output: { entryFileNames: 'main.js' } } },
});
