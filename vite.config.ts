import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - change 'expense' to your repo name
  base: '/expense/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
