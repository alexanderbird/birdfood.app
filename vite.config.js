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
