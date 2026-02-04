import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/_variables.scss" as *; @use "@/styles/_mixins.scss" as *;`,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('gsap')) return 'vendor-gsap';
            return 'vendor-core';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});