import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,   // ✅ Vite server will run on http://localhost:3001
    host: true,   // ✅ allows access from network (for Live Share, etc.)
  },
})
