import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), // Add React plugin
    tailwindcss(),
  ],
  // Configure for SPA routing
  server: {
    historyApiFallback: true
  }
})