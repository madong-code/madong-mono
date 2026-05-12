import type { RouteRecordRaw } from 'vue-router'

import { $t } from '#/locales'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:activity',
      order: 20,
      title: $t('monitor.logs.login.title'),
    },
    name: 'Monitor',
    path: '/monitor',
    children: [
      // {
      //   name: 'MonitorLogs',
      //   path: '/monitor/logs',
      //   meta: {
      //     icon: 'lucide:file-text',
      //     title: $t('monitor.logs.login.title'),
      //   },
      //   children: [
      //     {
      //       name: 'LoginLog',
      //       path: '/monitor/logs/login',
      //       component: () => import('#/views/monitor/logs/login/index.vue'),
      //       meta: {
      //         icon: 'lucide:log-in',
      //         title: $t('monitor.logs.login.title'),
      //       },
      //     },
      //     {
      //       name: 'OperateLog',
      //       path: '/monitor/logs/operate',
      //       component: () => import('#/views/monitor/logs/operate/index.vue'),
      //       meta: {
      //         icon: 'lucide:clipboard-list',
      //         title: $t('monitor.logs.operate.title'),
      //       },
      //     },
      //   ],
      // },
      {
        name: 'RedisMonitor',
        path: '/monitor/redis',
        component: () => import('#/views/monitor/redis/index.vue'),
        meta: {
          icon: 'lucide:database',
          title: $t('monitor.redis.title'),
        },
      },
      {
        name: 'ServerMonitor',
        path: '/monitor/server',
        component: () => import('#/views/monitor/server/index.vue'),
        meta: {
          icon: 'lucide:server',
          title: $t('monitor.server.title'),
        },
      },
    ],
  },
]

export default routes
