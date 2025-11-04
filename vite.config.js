import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy configuration has been removed because App.jsx now uses the absolute API URL,
    // making the proxy redundant in the development setup.
  }
})
