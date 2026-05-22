import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          // '/adminapi': {
          //   changeOrigin: true,
          //   rewrite: (path) => path.replace(/^\/adminapi/, ''),
          //   // 后端接口地址
          //   target: 'http://127.0.0.1:8500/adminapi',
          //   ws: true,
          // },
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 后端接口地址
            target: 'http://127.0.0.1:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
