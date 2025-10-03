// vite.config.js
import { defineConfig } from "file:///E:/Code/vue_project/smarttt_foreend/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/Code/vue_project/smarttt_foreend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import legacy from "file:///E:/Code/vue_project/smarttt_foreend/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ["ie>=11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
    })
  ],
  server: {
    port: 8081,
    proxy: {
      "/api": {
        // target: 'http://60.205.178.180:8080',
        target: "http://127.0.0.1:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, "")
      },
      "/page": {
        target: "http://60.205.178.180:8084",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, "")
      },
      "/fork": {
        target: "http://60.205.178.180:8084",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, "")
      },
      "/common": {
        target: "http://60.205.178.180:8084",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, "")
      },
      "/term": {
        target: "http://60.205.178.180:8084",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, "")
      }
    }
  },
  base: "/",
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("pdfjs-dist")) {
            return "pdfjs-dist";
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ["pdfjs-dist"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxDb2RlXFxcXHZ1ZV9wcm9qZWN0XFxcXHNtYXJ0dHRfZm9yZWVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcQ29kZVxcXFx2dWVfcHJvamVjdFxcXFxzbWFydHR0X2ZvcmVlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0NvZGUvdnVlX3Byb2plY3Qvc21hcnR0dF9mb3JlZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIGxlZ2FjeSh7XHJcbiAgICAgIHRhcmdldHM6IFsnaWU+PTExJ10sXHJcbiAgICAgIGFkZGl0aW9uYWxMZWdhY3lQb2x5ZmlsbHM6IFsncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJ11cclxuICAgIH0pXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDgwODEsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vNjAuMjA1LjE3OC4xODA6ODA4MCcsXHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTo4MDgyJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC8vLCAnJylcclxuICAgICAgfSxcclxuXHJcbiAgICAgICcvcGFnZSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vNjAuMjA1LjE3OC4xODA6ODA4NCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9eXFwvLywgJycpXHJcbiAgICAgIH0sXHJcbiAgICAgICcvZm9yayc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vNjAuMjA1LjE3OC4xODA6ODA4NCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9eXFwvLywgJycpXHJcbiAgICAgIH0sXHJcbiAgICAgICcvY29tbW9uJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly82MC4yMDUuMTc4LjE4MDo4MDg0JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC8vLCAnJylcclxuICAgICAgfSxcclxuICAgICAgJy90ZXJtJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly82MC4yMDUuMTc4LjE4MDo4MDg0JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC8vLCAnJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmFzZTogJy8nLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogJy9zcmMnXHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncGRmanMtZGlzdCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncGRmanMtZGlzdCc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFsncGRmanMtZGlzdCddXHJcbiAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUyxTQUFTLG9CQUFvQjtBQUNoVSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBRW5CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxRQUFRO0FBQUEsTUFDbEIsMkJBQTJCLENBQUMsNkJBQTZCO0FBQUEsSUFDM0QsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQTtBQUFBLFFBRU4sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxPQUFPLEVBQUU7QUFBQSxNQUN6QztBQUFBLE1BRUEsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxPQUFPLEVBQUU7QUFBQSxNQUN6QztBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxPQUFPLEVBQUU7QUFBQSxNQUN6QztBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxPQUFPLEVBQUU7QUFBQSxNQUN6QztBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxPQUFPLEVBQUU7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUNmLGNBQUksR0FBRyxTQUFTLFlBQVksR0FBRztBQUM3QixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsWUFBWTtBQUFBLEVBQ3hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
