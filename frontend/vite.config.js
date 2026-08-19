import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/execute': {
        target: 'https://emkc.org',
        changeOrigin: true,
        rewrite: () => '/api/v2/piston/execute'
      }
    }
  },
});
