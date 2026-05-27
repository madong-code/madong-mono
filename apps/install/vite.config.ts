import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

export default ({ mode }: { mode: string }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const { VITE_PORT, VITE_BASE, VITE_GLOB_API_URL } = env

  return defineConfig({
    plugins: [
      vue(),
      ElementPlus({
        format: 'esm',
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue'],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: Number(VITE_PORT) || 5888,
      proxy: {
        '/adminapi': {
          target: 'http://127.0.0.1:8500/adminapi',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/adminapi/, ''),
          ws: true,
        },
      },
      host: '0.0.0.0',
      allowedHosts: true,
    },
    base: VITE_BASE || '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
    publicDir: 'public',
  })
}
