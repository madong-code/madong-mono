import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:puzzle',
      order: 70,
      title: $t('plugin.delegation.title'),
    },
    name: 'Plugin',
    path: '/plugin',
    children: [
      {
        name: 'PluginDelegation',
        path: '/plugin/delegation',
        component: () => import('#/views/plugin/delegation/index.vue'),
        meta: {
          icon: 'lucide:key',
          title: $t('plugin.delegation.title'),
        },
      },
    ],
  },
];

export default routes;
