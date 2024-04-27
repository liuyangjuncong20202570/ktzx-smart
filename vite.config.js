import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['ie>=11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  server:{
    port:8081
  },
  base: './',
  build: {
    sourcemap: true  // 开启生产环境的 source maps
  }
})