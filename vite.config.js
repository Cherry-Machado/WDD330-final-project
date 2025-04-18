import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env.VITE_WELCOME_MESSAGE);
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
      port: 3002,
      open: true,
      cors: true,
      fs: { strict: false },
    },
  };
});

/*import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  console.log(env.VITE_WELCOME_MESSAGE);
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
      cors: true,
      fs: { strict: false },
      hmr: true,
      history: {
        rewrites: [
          {
            from: /^\/.*$/,
            to: '/index.html',
          },
        ],
      },
    },
  };
});
*/
