import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split large third-party libraries into their own long-lived chunks.
        // These rarely change, so browsers keep them cached across app updates,
        // and the main app bundle stays small.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-app': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'gsap-vendor': ['gsap', '@gsap/react'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
