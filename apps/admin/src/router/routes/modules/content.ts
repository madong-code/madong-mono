import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:list-checks',
      order: 31,
      title: $t('content.review.title'),
    },
    name: 'Content',
    path: '/content',
    children: [
      {
        name: 'ContentReview',
        path: '/content/review',
        component: () => import('#/views/content/review/index.vue'),
        meta: {
          icon: 'lucide:check-circle',
          title: $t('content.review.title'),
        },
      },
      {
        name: 'ContentNotice',
        path: '/content/notice',
        component: () => import('#/views/content/notice/index.vue'),
        meta: {
          icon: 'lucide:megaphone',
          title: $t('content.notice.title'),
        },
      },
      {
        name: 'ContentMessage',
        path: '/content/message',
        component: () => import('#/views/content/message/index.vue'),
        meta: {
          icon: 'lucide:mail',
          title: $t('content.message.title'),
        },
      },
    ],
  },
];

export default routes;
