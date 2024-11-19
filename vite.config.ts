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
    resolve: {
      alias: {
        '@Constants': path.resolve(__dirname, 'src/common/constants'),
        '@Enums': path.resolve(__dirname, 'src/common/enums'),
        '@Helpers': path.resolve(__dirname, 'src/common/helpers'),
        '@Hooks': path.resolve(__dirname, 'src/common/hooks'),
        '@Providers': path.resolve(__dirname, 'src/common/providers'),
        '@Store': path.resolve(__dirname, 'src/common/store'),
        '@Themes': path.resolve(__dirname, 'src/common/themes'),
        '@Types': path.resolve(__dirname, 'src/common/types'),
        '@Utils': path.resolve(__dirname, 'src/common/utils'),
      },
    },
  }
})
