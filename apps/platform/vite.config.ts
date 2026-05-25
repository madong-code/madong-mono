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
          '/platformapi': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/platformapi/, ''),
            // 后端接口地址
            target: 'http://127.0.0.1:8500/platformapi',
            ws: true,
          },
          // '/adminapi': {
          //   changeOrigin: true,
          //   rewrite: (path) => path.replace(/^\/adminapi/, ''),
          //   target: 'http://localhost:5320/api/platform',//使用mock 要修改为localhost:5320
          //   ws: true,
          // },
        },
      },
    },
  };
});
