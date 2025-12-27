// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No more @tailwindcss/vite import → removed completely

export default defineConfig({
  plugins: [react()],
})