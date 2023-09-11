import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset,
  images: [
    'public/favicon.svg'
    'public/apple-touch-icon-180x180.pngg',
    'public/pwa-64x64.pngg',
    'public/pwa-192x192.pngg',
    'public/favicon.icog',
    'public/pwa-512x512.pngg',
    'public/maskable-icon-512x512.pngg',
  ]
})
