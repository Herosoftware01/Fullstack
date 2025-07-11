// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),tailwindcss(),],
//   optimizeDeps: {
//     include: ['jquery', 'datatables.net', 'datatables.net-dt', 'datatables.net-buttons', 'datatables.net-buttons-dt']
//   },
//   server: {
//     // host: '10.1.21.13', 
//     // host: '103.125.155.133', 
//     host: '0.0.0.0', 
//     port: 7002,          
//     strictPort: true 
//   }
  
// })


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'jquery',
      'datatables.net',
      'datatables.net-dt',
      'datatables.net-buttons',
      'datatables.net-buttons-dt',
      'datatables.net-buttons/js/buttons.colVis.js' // 👈 important for colVis button
    ]
  },
  server: {
    host: '0.0.0.0', // ✅ accessible on LAN
    port: 7002,
    strictPort: true
  }
});