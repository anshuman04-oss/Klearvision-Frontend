import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Replace 3000 with your desired port number
  },
})


























// server: {
//   proxy: {
//     '/api': {
//       target: 'https://8xk6jj6h71.execute-api.ap-south-1.amazonaws.com',
//       changeOrigin: true,
//       rewrite: (path) => path.replace(/^\/api/, ''),
//     },
//   },
// },