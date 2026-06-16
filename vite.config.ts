import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5176,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://first-backend-git-develop-navike21.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        presets: [reactCompilerPreset()],
      },
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
