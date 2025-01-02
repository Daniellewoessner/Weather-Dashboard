import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Weather-Dashboard'
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})