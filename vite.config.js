import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bird Food',
        short_name: 'BirdFood',
        description: 'Streamlined Family Grocery Planning and Shopping',
        background_color: '#FFFFFF',
        theme_color: '#1976D2',
        icons: [
          { src: 'favicon.svg', type: 'image/x-icon', sizes: '16x16 32x32' },
          { src: 'icon-192.png', type: 'image/png', sizes: '192x192' },
          { src: 'icon-512.png', type: 'image/png', sizes: '512x512' },
          { src: 'icon-192-maskable.png', type: 'image/png', sizes: '192x192', purpose: 'maskable' },
          { src: 'icon-512-maskable.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
        ],
        start_url: '/',
        display: 'standalone',
      },
    }),
  ],
  test: {
    coverage: {
      all: true,
      provider: 'istanbul',
      reporter: ['html'],
    },
  },
});
