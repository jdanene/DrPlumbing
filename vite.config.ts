import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The static publisher copies public assets and only the site's selected photos.
  build: { copyPublicDir: false },
})
