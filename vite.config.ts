import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The static publisher copies public assets and only the site's selected photos.
  build: { copyPublicDir: false },
  // Whole-site tests render hundreds of routes; the default five seconds trips on a busy machine.
  test: { testTimeout: 30000 },
})
