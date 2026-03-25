import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react/')) {
            return 'react-vendor'
          }
          if (id.includes('react-router')) {
            return 'router'
          }
          if (id.includes('@reduxjs') || id.includes('react-redux')) {
            return 'redux'
          }
          if (id.includes('react-markdown') || id.includes('remark-gfm')) {
            return 'markdown'
          }
          if (id.includes('socket.io') || id.includes('axios') || id.includes('react-hot-toast')) {
            return 'ui'
          }
        },
      },
    },
  },
})