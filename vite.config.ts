import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  build: { outDir: 'build' },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})