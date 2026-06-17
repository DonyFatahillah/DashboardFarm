import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ['484b-112-78-161-214.ngrok-free.app','4475-112-78-161-214.ngrok-free.app','0d99-112-78-165-54.ngrok-free.app','aciduric-azariah-nonseparably.ngrok-free.dev', 'd99f-103-28-161-199.ngrok-free.app', 'e38f-182-253-233-167.ngrok-free.app', '4bce-112-78-161-108.ngrok-free.app', '40d6-112-78-161-108.ngrok-free.app', '83ce-103-28-161-199.ngrok-free.app', 'e422-2404-c0-2546-295f-4565-d3cb-1b59-4799.ngrok-free.app', '7c10-103-28-161-199.ngrok-free.app', 'c936-103-28-161-199.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
