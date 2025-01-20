import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [react()],
    define: {
      'process.env': env, // Make env variables accessible in code
    },
    build: {
      outDir: 'dist',
    },
  })
}
