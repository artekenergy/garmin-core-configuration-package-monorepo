import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],

  build: {
    // ES2017 target for Android 10 WebView / Chrome 83 compatibility
    target: 'es2017',

    // Output directory
    outDir: 'dist',

    // Clear output directory before build
    emptyOutDir: true,

    // Minification
    minify: 'terser',
    terserOptions: {
      ecma: 2017,
      compress: {
        // Remove console logs in production
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Disable source maps in production (not needed on device)
    sourcemap: false,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['preact'],
          signals: ['@preact/signals'],
        },
      },
    },
  },

  server: {
    port: 3001,
    strictPort: true,
    host: true,
    open: false,
  },

  preview: {
    port: 3001,
    strictPort: true,
    host: true,
  },

  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
});
