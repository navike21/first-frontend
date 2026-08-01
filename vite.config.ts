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
    // Only used if VITE_API_BASE_URL is ever left empty (the app normally
    // fetches VITE_API_BASE_URL directly, bypassing this proxy entirely).
    // Points at the test backend, never production — a safe fallback so an
    // empty/misconfigured .env can't silently start mutating real data.
    proxy: {
      '/api': {
        target: 'https://first-backend-git-test-navike21.vercel.app',
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
      // 'prompt' (not 'autoUpdate') — main.tsx calls updateSW() itself the
      // instant an update is found instead of waiting for the user or for
      // every open tab of this origin to close naturally. vite-plugin-pwa's
      // 'autoUpdate' client code never actually sends the skip-waiting
      // message on its own (confirmed reading its generated register.js —
      // that call is gated on `!auto`); it just waits for Workbox's default
      // no-controlled-clients moment, which on a long-lived mobile tab can
      // never arrive. Confirmed live: a deployed fix sat unapplied through
      // two full reloads until skip-waiting was sent manually.
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: 'First — Gestor navike21',
        short_name: 'First',
        description: 'Gestor navike21',
        // Navy Base del Manual de Marca First (#0B1220) — mismo tono que el
        // badge de la insignia (favicon.svg) y el fondo de secciones oscuras.
        theme_color: '#0b1220',
        background_color: '#0b1220',
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
        // `html` dropped on purpose — `navigateFallback` (below) used to be the
        // only thing referencing the precached index.html; without it the
        // precached copy would just be dead weight (see the runtimeCaching
        // note on why navigateFallback was replaced with a NetworkFirst rule).
        globPatterns: ['**/*.{js,css,svg,ico,woff,woff2,png}'],
        // The main bundle is currently ~3.4 MB; raise the precache size cap so
        // the shell is fully cached for offline. (TODO perf: code-split routes.)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // vite-plugin-pwa defaults `navigateFallback` to `"index.html"` even
        // when this key is simply omitted here — its own default silently wins
        // over an absent key, registering a cache-first NavigationRoute ahead
        // of the NetworkFirst rule below (confirmed by grepping the built
        // dist/sw.js: both routes were present, and Workbox's router matches
        // in registration order, so the old one always won). Must be set to
        // `undefined` explicitly, not just left out, to actually disable it.
        navigateFallback: undefined,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Page shell (any client-route navigation): NetworkFirst, not the
            // precached-instant `navigateFallback` this replaced. `generateSW`'s
            // navigateFallback always serves the PRECACHED shell instantly and
            // unconditionally for every navigation — a real user could load the
            // page, glance at it, and leave well before the background
            // detect-new-SW → precache (~3.4 MB) → activate → auto-reload cycle
            // in main.tsx finished, so they'd see stale content with no visible
            // sign anything was wrong (confirmed live: a deployed skeleton-
            // loading feature didn't show up on a normal page load, only a hard
            // reload — Ctrl+Shift+R bypasses the active SW entirely in Chrome —
            // forced it to appear). NetworkFirst tries the network first on
            // every navigation, so an online user always gets the latest shell;
            // it only falls back to this cache if the network request fails or
            // exceeds networkTimeoutSeconds.
            // Known trade-off, accepted: this caches per exact URL, not a
            // single shared shell entry like navigateFallback did — a route the
            // user never successfully loaded while online has no offline
            // fallback. Reaching full offline coverage again needs a hand-
            // written service worker (`injectManifest`, not `generateSW`) so
            // NetworkFirst can still resolve to one shared cached shell
            // regardless of the requested path — not done here, kept as a
            // deliberately smaller fix.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 5,
            },
          },
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
