/// <reference types="vitest" />

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'import.meta.env': JSON.stringify(env),
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
    resolve: {
      alias: {
        '@Assets': path.resolve(__dirname, 'src/common/assets'),
        '@Components': path.resolve(__dirname, 'src/common/components'),
        '@Constants': path.resolve(__dirname, 'src/common/constants'),
        '@Enums': path.resolve(__dirname, 'src/common/enums'),
        '@Helpers': path.resolve(__dirname, 'src/common/helpers'),
        '@Hooks': path.resolve(__dirname, 'src/common/hooks'),
        '@Layouts': path.resolve(__dirname, 'src/common/layouts'),
        '@Pages': path.resolve(__dirname, 'src/pages'),
        '@Providers': path.resolve(__dirname, 'src/common/providers'),
        '@Routes': path.resolve(__dirname, 'src/routes'),
        '@Store': path.resolve(__dirname, 'src/common/store'),
        '@Themes': path.resolve(__dirname, 'src/common/themes'),
        '@Types': path.resolve(__dirname, 'src/common/types'),
        '@Utils': path.resolve(__dirname, 'src/common/utils'),
      },
    },
  }
})
