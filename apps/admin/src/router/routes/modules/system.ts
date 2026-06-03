import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:cpu',
      order: 40,
      title: $t('system.menu.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'SystemMenu',
        path: '/system/menu',
        component: () => import('#/views/system/menu/index.vue'),
        meta: {
          icon: 'lucide:menu',
          title: $t('system.menu.title'),
        },
      },
      {
        name: 'SystemRole',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
        meta: {
          icon: 'lucide:shield-check',
          title: $t('system.role.title'),
        },
      },
      {
        name: 'SystemUser',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
        meta: {
          icon: 'lucide:users',
          title: $t('system.user.title'),
        },
      },
      {
        name: 'SystemDept',
        path: '/system/dept',
        component: () => import('#/views/system/dept/index.vue'),
        meta: {
          icon: 'lucide:network',
          title: $t('system.dept.title'),
        },
      },
      {
        name: 'SystemPost',
        path: '/system/post',
        component: () => import('#/views/system/post/index.vue'),
        meta: {
          icon: 'lucide:briefcase',
          title: $t('system.post.title'),
        },
      },
      {
        name: 'SystemDict',
        path: '/system/dict',
        component: () => import('#/views/system/dict/index.vue'),
        meta: {
          icon: 'lucide:book-open',
          title: $t('system.dict.title'),
        },
      },
      {
        name: 'SystemDictItem',
        path: '/system/dict-item',
        component: () => import('#/views/system/dict-item/index.vue'),
        meta: {
          icon: 'lucide:list',
          title: $t('system.dict.item.title'),
        },
      },
      {
        name: 'SystemConfig',
        path: '/system/config',
        component: () => import('#/views/system/config/index.vue'),
        meta: {
          icon: 'lucide:wrench',
          title: $t('system.config.title'),
        },
      },
      {
        name: 'SystemRecycle',
        path: '/system/recycle',
        component: () => import('#/views/system/recycle/index.vue'),
        meta: {
          icon: 'lucide:trash-2',
          title: $t('system.recycle.title'),
        },
      },
    ],
  },
];

export default routes;
