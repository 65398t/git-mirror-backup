import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  const { version } = JSON.parse(
    readFileSync(join(__dirname, 'src', 'version.json'), 'utf-8')
  )

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  }
})
