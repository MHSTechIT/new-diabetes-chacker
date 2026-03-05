import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnpluginImagemin from 'unplugin-imagemin/vite'

export default defineConfig({
  plugins: [
    react(),
    UnpluginImagemin({
      compress: {
        jpg: { quality: 75 },
        png: { lossless: true },
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
