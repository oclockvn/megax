import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:5291/", //import.meta.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
