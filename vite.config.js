import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { gttApiPlugin } from './server/gttApiPlugin.js';

export default defineConfig({
  plugins: [react(), gttApiPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false,
    watch: {
      ignored: ['**/public/**']
    }
  }
});

