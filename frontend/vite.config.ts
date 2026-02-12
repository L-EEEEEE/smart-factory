import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      // '/api'로 시작하는 요청은 8080으로 토스
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // '/ws-factory'로 시작하는 소켓 요청도 8080으로 토스
      '/ws-factory': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true, // 웹소켓 지원 설정
      }
    }
  }
})
