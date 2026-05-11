import type { RouteRecordRaw } from 'vue-router'

import { $t } from '#/locales'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:wrench',
      order: 50,
      title: $t('tools.crontab.title'),
    },
    name: 'Tools',
    path: '/tools',
    children: [
      {
        name: 'ToolsCrontab',
        path: '/tools/crontab',
        component: () => import('#/views/tools/crontab/index.vue'),
        meta: {
          icon: 'lucide:clock',
          title: $t('tools.crontab.title'),
        },
      },
      {
        name: 'ToolsFiles',
        path: '/tools/files',
        component: () => import('#/views/tools/files/index.vue'),
        meta: {
          icon: 'lucide:folder',
          title: $t('tools.files.title'),
        },
      },
      {
        name: 'ToolsRecycle',
        path: '/tools/recycle',
        component: () => import('#/views/tools/recycle/index.vue'),
        meta: {
          icon: 'lucide:trash-2',
          title: $t('tools.recycle.title'),
        },
      },
      {
        name: 'ToolsDelegation',
        path: '/tools/delegation',
        component: () => import('#/views/tools/delegation/index.vue'),
        meta: {
          icon: 'lucide:key',
          title: $t('tools.delegation.title'),
        },
      },
    ],
  },
]

export default routes
