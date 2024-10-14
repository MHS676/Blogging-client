import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['express', 'buffer', 'path', 'events', 'url', 'http']
  },
  build: {
    rollupOptions: {
      external: ['express', 'buffer', 'path', 'events', 'url', 'http']
    }
  }
})
