import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/bright-future-academy/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        register: resolve(__dirname, 'register.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        status: resolve(__dirname, 'status.html'),
        success: resolve(__dirname, 'success.html'),
        failed: resolve(__dirname, 'failed.html'),
        cancelled: resolve(__dirname, 'cancelled.html'),
        'access-pending': resolve(__dirname, 'access-pending.html'),
        help: resolve(__dirname, 'help.html'),
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
