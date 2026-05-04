import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['aciduric-azariah-nonseparably.ngrok-free.dev', 'e38f-182-253-233-167.ngrok-free.app', '4bce-112-78-161-108.ngrok-free.app', '40d6-112-78-161-108.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
