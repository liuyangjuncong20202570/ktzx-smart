import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      legacy({
        targets: ['ie>=11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      tailwindcss()
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
        '@': '/src'
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
    define: {
      'import.meta.env': {
        ...env
      }
    },
    optimizeDeps: {
      include: ['pdfjs-dist']
    }
  };
});
