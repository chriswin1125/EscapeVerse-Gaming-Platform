import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5500',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5500',
        ws: true
      }
    }
  }
});
