import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CatatKu',
        short_name: 'CatatKu',
        start_url: '/',
        display: 'standalone',
        theme_color: '#6258D9',
        background_color: '#ffffff',
      },
    }),
  ],
  build: { outDir: 'dist', sourcemap: false },
});
