import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

// Reference to `vite-plugin-svgr` types
/// <reference types="vite-plugin-svgr/client" />

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const parsedPort = Number(process.env.VITE_FRONTEND_PORT)
  const port = parsedPort ?? 7777

  return {
    server: {
      port,
      host: '0.0.0.0'
    },
    plugins: [
      react(),
      tsconfigPaths(),
      svgr({
        include: '**/*.svg?react',
        exclude: '',
        svgrOptions: {},
        esbuildOptions: {}
      })
    ]
  }
})
