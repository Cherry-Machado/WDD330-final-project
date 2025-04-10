// eslint-disable-next-line import/namespace
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log('Hour CMDER-1:', env.CMDER_INIT_START);

  return {
    root: resolve(__dirname, './'),
    publicDir: resolve(__dirname, './public'),
    build: {
      minify: false,
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
  };
});
// // Handle theme toggle;
