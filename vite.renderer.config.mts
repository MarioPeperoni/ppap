import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { PRODUCTION_CSP } from './src/constants/security.constants';
import { alias } from './vite.alias.mjs';

function contentSecurityPolicy(): Plugin {
  return {
    name: 'ppap:content-security-policy',
    apply: 'build',
    transformIndexHtml: (html) => ({
      html,
      tags: [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: PRODUCTION_CSP },
          injectTo: 'head-prepend',
        },
      ],
    }),
  };
}

export default defineConfig({
  resolve: { alias },
  plugins: [react(), tailwindcss(), contentSecurityPolicy()],
});
