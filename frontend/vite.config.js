import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
  })
}
