import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // ⚠️ ISSO AQUI É IMPORTANTE:
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      // Força inclusão de todos os assets
      external: [],
      output: {
        manualChunks: undefined
      }
    }
  },
  // ⚠️ E ISSO TAMBÉM:
  publicDir: false, // Desativa a pasta public padrão
  
  plugins: [
    // Plugin personalizado para copiar tudo
    {
      name: 'copy-all-assets',
      buildStart() {
        console.log('📁 Iniciando cópia de assets...')
      },
      generateBundle() {
        // Isso força o Vite a incluir todos os arquivos referenciados
      }
    }
  ],
  
  server: {
    host: true
  }
})