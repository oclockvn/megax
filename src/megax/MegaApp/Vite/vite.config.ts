import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
