import type { RouteRecordRaw } from 'vue-router'

import { $t } from '#/locales'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:users',
      order: 10,
      title: $t('member.level.title'),
    },
    name: 'Member',
    path: '/member',
    children: [
      {
        name: 'MemberLevel',
        path: '/member/level',
        component: () => import('#/views/member/level/index.vue'),
        meta: {
          icon: 'lucide:award',
          title: $t('member.level.title'),
        },
      },
      {
        name: 'MemberPoints',
        path: '/member/points',
        component: () => import('#/views/member/points/index.vue'),
        meta: {
          icon: 'lucide:coins',
          title: $t('member.points.title'),
        },
      },
      {
        name: 'MemberTag',
        path: '/member/tag',
        component: () => import('#/views/member/tag/index.vue'),
        meta: {
          icon: 'lucide:tag',
          title: $t('member.tag.title'),
        },
      },
      {
        name: 'MemberUser',
        path: '/member/user',
        component: () => import('#/views/member/user/index.vue'),
        meta: {
          icon: 'lucide:user',
          title: $t('member.user.title'),
        },
      },
    ],
  },
]

export default routes
