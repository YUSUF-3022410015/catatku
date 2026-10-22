import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'CatatKu',
        short_name: 'CatatKu',
        start_url: '/',
        display: 'standalone',
        theme_color: '#6258D9',
        background_color: '#ffffff',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    }),
  ],
  build: { outDir: 'dist', sourcemap: false },
});
