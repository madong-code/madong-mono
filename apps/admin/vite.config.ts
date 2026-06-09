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
            // 后端接口地址
            target: 'http://127.0.0.1:8500/adminapi',
            ws: true,
          },
          // 上传文件静态资源代理（对应 storage.php 中的 domain 配置）
          '/upload': {
            changeOrigin: true,
            target: 'http://127.0.0.1:8500',
          },
        },
      },
    },
  };
});
