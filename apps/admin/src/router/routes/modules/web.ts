import type { RouteRecordRaw } from 'vue-router'

import { $t } from '#/locales'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:globe',
      order: 60,
      title: $t('web.link.title'),
    },
    name: 'Web',
    path: '/web',
    children: [
      {
        name: 'WebLink',
        path: '/web/link',
        component: () => import('#/views/web/link/index.vue'),
        meta: {
          icon: 'lucide:link',
          title: $t('web.link.title'),
        },
      },
      {
        name: 'WebMenu',
        path: '/web/menu',
        component: () => import('#/views/web/menu/index.vue'),
        meta: {
          icon: 'lucide:layout-list',
          title: $t('web.menu.title'),
        },
      },
    ],
  },
]

export default routes
