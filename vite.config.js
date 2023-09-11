import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      includeAssets: [
        'favicon.svg',
        'pwa-64x64.png',
        'pwa-192x192.png',
        'apple-touch-icon-180x180.png',
        'favicon.ico',
        'maskable-icon-512x512.png',
        'pwa-512x512.png',
      ],
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bird Food',
        short_name: 'BirdFood',
        description: 'Streamlined Family Grocery Planning and Shopping',
        background_color: '#FFFFFF',
        theme_color: '#1976D2',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '16x16 24x24 32x32 64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
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
