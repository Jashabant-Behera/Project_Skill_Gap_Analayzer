import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true, // Fail if port 3000 is already in use instead of auto-incrementing
    open: true, // Automatically open browser on server start
  },
})
