import type { RouteRecordRaw } from 'vue-router'

import { $t } from '#/locales'

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 30,
      title: $t('setting.config.title'),
    },
    name: 'Setting',
    path: '/setting',
    children: [
      {
        name: 'SettingConfig',
        path: '/setting/config',
        component: () => import('#/views/setting/config/index.vue'),
        meta: {
          icon: 'lucide:wrench',
          title: $t('setting.config.title'),
        },
      },
      {
        name: 'SettingDept',
        path: '/setting/dept',
        component: () => import('#/views/setting/dept/index.vue'),
        meta: {
          icon: 'lucide:network',
          title: $t('setting.dept.title'),
        },
      },
      {
        name: 'SettingDict',
        path: '/setting/dict',
        component: () => import('#/views/setting/dict/index.vue'),
        meta: {
          icon: 'lucide:book-open',
          title: $t('setting.dict.title'),
        },
      },
      {
        name: 'SettingDictItem',
        path: '/setting/dict-item',
        component: () => import('#/views/setting/dict-item/index.vue'),
        meta: {
          icon: 'lucide:list',
          title: $t('setting.dict.item.title'),
        },
      },
      {
        name: 'SettingGateway',
        path: '/setting/gateway',
        meta: {
          icon: 'lucide:shield',
          title: $t('setting.gateway.limiter.title'),
        },
        children: [
          {
            name: 'GatewayLimiter',
            path: '/setting/gateway/limiter',
            component: () => import('#/views/setting/gateway/limiter/index.vue'),
            meta: {
              icon: 'lucide:gauge',
              title: $t('setting.gateway.limiter.title'),
            },
          },
          {
            name: 'GatewayBlacklist',
            path: '/setting/gateway/blacklist',
            component: () => import('#/views/setting/gateway/blacklist/index.vue'),
            meta: {
              icon: 'lucide:ban',
              title: $t('setting.gateway.blacklist.title'),
            },
          },
        ],
      },
      {
        name: 'SettingMessage',
        path: '/setting/message',
        component: () => import('#/views/setting/message/index.vue'),
        meta: {
          icon: 'lucide:mail',
          title: $t('setting.message.title'),
        },
      },
      {
        name: 'SettingNotice',
        path: '/setting/notice',
        component: () => import('#/views/setting/notice/index.vue'),
        meta: {
          icon: 'lucide:megaphone',
          title: $t('setting.notice.title'),
        },
      },
      {
        name: 'SettingPost',
        path: '/setting/post',
        component: () => import('#/views/setting/post/index.vue'),
        meta: {
          icon: 'lucide:briefcase',
          title: $t('setting.post.title'),
        },
      },
      {
        name: 'SettingReview',
        path: '/setting/review',
        component: () => import('#/views/setting/review/index.vue'),
        meta: {
          icon: 'lucide:check-circle',
          title: $t('setting.review.title'),
        },
      },
    ],
  },
]

export default routes
