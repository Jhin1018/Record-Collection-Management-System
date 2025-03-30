import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 在 ESM 环境中模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
      '@styles': resolve(__dirname, './src/styles'),
      '@utils': resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
