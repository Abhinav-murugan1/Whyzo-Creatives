import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  /* Development diagnostics have no business shipping to visitors */
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    /*
     * Framer Motion powers two hover-magnetic CTAs and nothing else. Vite hoists a lazy chunk's shared
     * dependencies into the entry's modulepreload list, which pulled all 28 kB of it down on first paint
     * for an effect nobody can see until they move a cursor over a button. Dropping it from the preload
     * manifest leaves the chunk to load when MagneticButtonMotion is actually imported; the plain button
     * renders identically in the meantime, so nothing waits on it.
     */
    modulePreload: {
      resolveDependencies: (_filename, deps) => deps.filter(dep => !dep.includes('vendor-motion'))
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three'
            }
            // gsap (StaggeredMenu) and framer-motion (magnetic CTAs) ship separately so a change in
            // one does not invalidate the other's cache entry
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
            if (id.includes('motion')) {
              return 'vendor-motion'
            }
            if (id.includes('@paper-design')) {
              return 'vendor-shaders'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
          }
        },
      },
    },
  },
})

