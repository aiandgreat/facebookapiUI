import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to the remote backend (Render deployment)
    proxy: {
      '/api': {
        target: 'https://post-api-t9gq.onrender.com', // Updated URL
        changeOrigin: true,
        // The 'secure: false' flag was removed as we are targeting a production HTTPS endpoint.
      }
    }
  }
})
