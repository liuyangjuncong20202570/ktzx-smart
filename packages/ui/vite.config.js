import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src', // 生成声明文件的目录
      outputDir: 'dist/types' // 输出类型文件位置
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'NCUT-KTZX-COMP', // UMD构建时的全局变量名，可随意命名
      formats: ['es', 'cjs'], // 输出格式
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      // 外部依赖（不打包到输出文件中）
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    outDir: 'dist', // 输出目录
    emptyOutDir: true // 清空旧文件
  }
});
