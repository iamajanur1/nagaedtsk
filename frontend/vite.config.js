import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:5050',
        changeOrigin: true
      },
      '/ai': {
        target: process.env.AI_PROXY_TARGET || 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ai/, '')
      }
    }
  }
});
