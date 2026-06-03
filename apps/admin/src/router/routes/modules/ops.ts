import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:activity',
      order: 20,
      title: $t('ops.server.title'),
    },
    name: 'Ops',
    path: '/ops',
    children: [
      {
        name: 'OpsCrontab',
        path: '/ops/crontab',
        component: () => import('#/views/ops/crontab/index.vue'),
        meta: {
          icon: 'lucide:clock',
          title: $t('ops.crontab.title'),
        },
      },
      {
        name: 'OpsRedis',
        path: '/ops/redis',
        component: () => import('#/views/ops/redis/index.vue'),
        meta: {
          icon: 'lucide:database',
          title: $t('ops.redis.title'),
        },
      },
      {
        name: 'OpsServer',
        path: '/ops/server',
        component: () => import('#/views/ops/server/index.vue'),
        meta: {
          icon: 'lucide:server',
          title: $t('ops.server.title'),
        },
      },
      {
        name: 'OpsGateway',
        path: '/ops/gateway',
        meta: {
          icon: 'lucide:shield',
          title: $t('ops.gateway.limiter.title'),
        },
        children: [
          {
            name: 'OpsGatewayLimiter',
            path: '/ops/gateway/limiter',
            component: () => import('#/views/ops/gateway/limiter/index.vue'),
            meta: {
              icon: 'lucide:gauge',
              title: $t('ops.gateway.limiter.title'),
            },
          },
          {
            name: 'OpsGatewayBlacklist',
            path: '/ops/gateway/blacklist',
            component: () => import('#/views/ops/gateway/blacklist/index.vue'),
            meta: {
              icon: 'lucide:ban',
              title: $t('ops.gateway.blacklist.title'),
            },
          },
        ],
      },
    ],
  },
];

export default routes;
