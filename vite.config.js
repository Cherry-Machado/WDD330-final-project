// eslint-disable-next-line import/namespace
import { defineConfig } from 'vite';
import { resolve } from 'path';

console.log('TMDB_API_KEY:', import.meta.env.VITE_TMDB_API_KEY);
console.log('OMDB_API_KEY:', import.meta.env.VITE_OMDB_API_KEY);
//console.log('TMDB_API_KEY:', process.env.VITE_OMDB_API_KEY); // Para verificar que se lee
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
//
