import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['ie>=11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://120.46.201.4:9000',
        // target: 'http://127.0.0.1:8082',
        changeOrigin: true,
        rewrite: path => path.replace(/^\//, '')
      },

      '/page': {
        target: 'http://120.46.201.4:10203',
        changeOrigin: true,
        rewrite: path => path.replace(/^\//, '')
      },
      '/fork': {
        target: 'http://120.46.201.4:10203',
        changeOrigin: true,
        rewrite: path => path.replace(/^\//, '')
      },
      '/common': {
        target: 'http://120.46.201.4:10203',
        changeOrigin: true,
        rewrite: path => path.replace(/^\//, '')
      },
      '/term': {
        target: 'http://120.46.201.4:10203',
        changeOrigin: true,
        rewrite: path => path.replace(/^\//, '')
      }
    }
  },
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
      '@vue-office/docx': '@vue-office/docx/lib/v3',
      '@vue-office/excel': '@vue-office/docx/lib/v3',
      '@vue-office/pdf': '@vue-office/pdf/lib/v3'
    }
  },
  build: {
    minify: 'esbuild',

    // 推荐使用 esbuild 配置来剔除 console
    esbuild: {
      drop: ['console', 'debugger']
    },
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
