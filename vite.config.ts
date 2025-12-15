import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Backend Port
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000, //Explicitly set the Frontend Port to 3000
  },
});