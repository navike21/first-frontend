import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tanstackStart({
      router: {
        routesDirectory: './pages',
        generatedRouteTree: './routeTree.gen.ts',
        quoteStyle: 'single',
        semicolons: false,
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: 'esnext',
  },
})
