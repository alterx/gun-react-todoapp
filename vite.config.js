import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: 'build',
  },
  plugins: [reactPlugin()],
  server: {
    port: 3000,
  },
});
