/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
    server: {
      port: 3000,
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
        '@Styles': path.resolve(__dirname, 'src/common/styles'),
        '@Themes': path.resolve(__dirname, 'src/common/themes'),
        '@Types': path.resolve(__dirname, 'src/common/types'),
        '@Utils': path.resolve(__dirname, 'src/common/utils'),
      },
    },
  }
})
