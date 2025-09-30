import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // IMPORTANTE: Isso faz os caminhos serem relativos
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    host: true,
    port: 3000
  }
})