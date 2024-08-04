import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['ie>=11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://60.205.178.180:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, '')
      },
      '/page': {
        target: 'http://60.205.178.180:8084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, '')
      },
      '/fork': {
        target: 'http://60.205.178.180:8084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, '')
      },
      '/common': {
        target: 'http://60.205.178.180:8084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, '')
      },
      '/term': {
        target: 'http://60.205.178.180:8084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, '')
      },
    }
  },
  base: './',
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('pdfjs-dist')) {
            return 'pdfjs-dist';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  }
});
