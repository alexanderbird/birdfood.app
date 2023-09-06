import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  test: {
    coverage: {
      all: true,
      provider: 'istanbul',
      reporter: ['html'],
    },
  },
});
