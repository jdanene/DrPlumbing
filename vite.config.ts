import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // The static publisher copies public assets and only the site's selected photos.
  build: {
    copyPublicDir: false,
    // SSR uses the command's entry; the browser build includes the private gallery.
    ...(isSsrBuild ? {} : {
      rolldownOptions: {
        input: {
          main: 'index.html',
          comparison: 'brand-comparison/index.html',
        },
      },
    }),
  },
}))
