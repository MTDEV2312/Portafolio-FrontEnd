// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Configuración de SSG (Static Site Generation)
  output: 'static',
  
  // Configuración de build
  build: {
    inlineStylesheets: 'auto'
  },
  
  // Configuración de Vite
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    }
  },

  // Integraciones de Astro
  integrations: [react()],
  
  // Servidor local de desarrollo
  server: {
    port: 4321,
    host: true
  }
});