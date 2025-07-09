import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    // host: '10.1.21.13', 
    // host: '103.125.155.133', 
    host: '0.0.0.0', 
    port: 7002,          
    strictPort: true 
  }
  
})

