import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Escucha en todas las interfaces de red (0.0.0.0)
    port: 5173, // Puerto por defecto
    strictPort: false, // Permite cambiar de puerto si 5173 está ocupado
  },
})
