import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, './'),
  publicDir: resolve(__dirname, './public'),
  build: {
    outDir: resolve(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
// import { defineConfig } from 'vite';
