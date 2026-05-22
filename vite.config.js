// Vite build and dev-server settings, including API proxies for local development.
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      // Same-origin /api in dev so HttpOnly site-gate cookies work with VITE_API_BASE_URL=/api
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '') || '/',
      },
      '/melbourne-ods-api': {
        target: 'https://data.melbourne.vic.gov.au',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/melbourne-ods-api/, ''),
      },
      '/osrm-api': {
        target: 'https://router.project-osrm.org',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/osrm-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    minify: false
  }
})