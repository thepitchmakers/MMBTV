import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ babel: false })],
  base: '/MMBTV/',   // ← change 'MMBTV' to your exact GitHub repo name
})
