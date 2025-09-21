process.env.VITE_CJS_IGNORE_WARNING = 'true';

import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    environmentMatchGlobs: [
      ['src/components/**/*.test.tsx', 'jsdom'],
      ['src/components/**/*.test.ts', 'jsdom'],
      ['src/providers/**/*.test.tsx', 'jsdom'],
    ],
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
