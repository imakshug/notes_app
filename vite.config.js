import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ai-notes-app/', // Replace with your repo name
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
