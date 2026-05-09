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
          '/adminapi': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/adminapi/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api/admin',
            ws: true,
          },
        },
      },
    },
  };
});
