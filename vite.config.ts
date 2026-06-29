import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5176,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://first-backend-navike21.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    // NOTE: @vitejs/plugin-react v5 (rolldown/oxc) removed the `babel` option,
    // so the previous `babel: { presets: [reactCompilerPreset()] }` was dead
    // config (ignored at runtime → React Compiler was NOT active). To re-enable
    // it, wire `@rolldown/plugin-babel` with `reactCompilerPreset()` separately.
    react(),
    // Offline-first: precache the app shell so it loads without network. Data
    // is cached separately by TanStack Query (IndexedDB), so the SW only needs
    // the shell + nav fallback + fonts. Registration is manual (main.tsx) to
    // keep it in the bundle and CSP-safe (no injected inline script).
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: {
        name: 'First — Gestor navike21',
        short_name: 'First',
        description: 'Gestor navike21',
        theme_color: '#1c252e',
        background_color: '#1c252e',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2,png}'],
        // The main bundle is currently ~3.4 MB; raise the precache size cap so
        // the shell is fully cached for offline. (TODO perf: code-split routes.)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@domains': path.resolve(__dirname, './src/domains'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/app/testing/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/**/index.ts',
        'src/**/index.tsx',
        'src/**/types.ts',
        'src/**/*.types.ts',
        'src/shared/types/**',
        'src/**/*.d.ts',
        'src/app/router/root.ts',
        'src/app/testing/**',
        // Complex UI components requiring extensive DOM simulation — excluded from coverage
        'src/shared/ui/molecules/InputDate/**',
        'src/shared/ui/molecules/PhotoPicker/**',
        // i18n locale data files — V8 coverage artifact on pure object exports
        'src/**/i18n/locales/**',
        // SSR-only code path: server snapshot never called in jsdom
        'src/shared/lib/use-mounted.ts',
        // Real HTTP client — requires mocking the entire fetch API contract
        'src/shared/api/auth/auth.api.ts',
      ],
    },
  },
})
