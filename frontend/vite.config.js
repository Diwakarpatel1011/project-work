import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tailwindcss(), react()],

  // ✅ IMPORTANT for Netlify & Vercel
  base: '/',  

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 👈 sirf local dev ke liye
        changeOrigin: true,
      }
    }
  }
})
