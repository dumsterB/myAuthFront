import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/auth-back': {
        target: 'https://usnc.dev-webdevep.ru',
        changeOrigin: true,
      },
    },
  },
})
