import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // El usuario decide cuándo actualizar (no autoUpdate)
      registerType: 'prompt',

      // CRÍTICO: sin esto el Service Worker rompe el servidor de desarrollo
      devOptions: { enabled: false },

      manifest: {
        name: 'Oliva Devs',
        short_name: 'Oliva',
        description: 'Calculadora de Ofertas — Oliva Devs',
        display: 'standalone',
        theme_color: '#3fb950',
        background_color: '#0d1117',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            // Indica que este ícono tiene safe zone para recorte circular/cuadrado
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Estrategia NetworkFirst para llamadas a APIs externas
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
            },
          },
          {
            // NetworkOnly para rutas de autenticación (nunca servir desde caché)
            urlPattern: /\/auth\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: {
    // Mantiene 'build/' como directorio de salida para compatibilidad con Capacitor
    outDir: 'build',
  },
})
