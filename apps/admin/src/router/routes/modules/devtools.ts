import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:wrench',
      order: 60,
      title: $t('tools.files.title'),
    },
    name: 'DevTools',
    path: '/devtools',
    children: [
      {
        name: 'DevToolsFiles',
        path: '/devtools/files',
        component: () => import('#/views/devtools/files/index.vue'),
        meta: {
          icon: 'lucide:folder',
          title: $t('tools.files.title'),
        },
      },
    ],
  },
];

export default routes;
