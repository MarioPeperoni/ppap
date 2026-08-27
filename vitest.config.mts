import { defineConfig } from 'vitest/config';
import { alias } from './vite.alias.mjs';

export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
});
