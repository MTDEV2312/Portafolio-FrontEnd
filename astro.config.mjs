// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Configuración de SSG (Static Site Generation)
  output: 'static', // Genera un sitio completamente estático
  
  // Configuración de build
  build: {
    // Genera archivos HTML estáticos
    inlineStylesheets: 'auto'
  },
  
  // Configuración de Vite
  vite: {
    plugins: [tailwindcss()],
    // Configuración para optimizar el build
    build: {
      rollupOptions: {
        output: {
          // Optimizar chunks para mejor cacheo
          manualChunks: undefined,
        }
      }
    },
    // Configuración del servidor de desarrollo
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
      }
    }
  },

  // Configuración de integración
  integrations: [],
  
  // Configuración de servidor de desarrollo
  server: {
    port: 4321,
    host: true
  }
});