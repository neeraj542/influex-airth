import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default ({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'components': path.resolve(__dirname, 'src/components'),
        'utils': path.resolve(__dirname, 'src/lib/utils'),
        'ui': path.resolve(__dirname, 'src/components/ui'),
        'lib': path.resolve(__dirname, 'src/lib'),
        'hooks': path.resolve(__dirname, 'src/hooks'),
      },
    },
  })
}
