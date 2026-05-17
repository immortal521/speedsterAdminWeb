import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://14.103.249.252:9527', // 后端接口地址
        changeOrigin: true,

        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
