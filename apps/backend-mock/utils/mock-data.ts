export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
}

export interface TimezoneOption {
  offset: number;
  timezone: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Vben',
    roles: ['super'],
    username: 'vben',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
    homePath: '/workspace',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
    homePath: '/analytics',
  },
];

export const MOCK_CODES = [
  {
    codes: [
      'AC_100100',
      'AC_100110',
      'AC_100120',
      'AC_100010',
      'member:level:create',
      'member:level:delete',
      'member:level:update',
      'member:level:read',
      'member:user:create',
      'member:user:delete',
      'member:user:update',
      'member:user:read',
      'member:tag:create',
      'member:tag:delete',
      'member:tag:update',
      'member:tag:read',
      'member:points:create',
      'member:points:delete',
      'member:points:update',
      'member:points:read',
      'system:user:create',
      'system:user:delete',
      'system:user:update',
      'system:user:read',
      'system:role:create',
      'system:role:delete',
      'system:role:update',
      'system:role:read',
      'system:menu:create',
      'system:menu:delete',
      'system:menu:update',
      'system:menu:read',
      'setting:dict:create',
      'setting:dict:delete',
      'setting:dict:update',
      'setting:dict:read',
      'setting:dept:create',
      'setting:dept:delete',
      'setting:dept:update',
      'setting:dept:read',
      'setting:post:create',
      'setting:post:delete',
      'setting:post:update',
      'setting:post:read',
      'setting:notice:create',
      'setting:notice:delete',
      'setting:notice:update',
      'setting:notice:read',
      'setting:message:create',
      'setting:message:delete',
      'setting:message:update',
      'setting:message:read',
      'setting:config:update',
      'setting:config:read',
      'setting:review:create',
      'setting:review:delete',
      'setting:review:update',
      'setting:review:read',
      'setting:gateway:limiter:create',
      'setting:gateway:limiter:delete',
      'setting:gateway:limiter:update',
      'setting:gateway:limiter:read',
      'setting:gateway:blacklist:create',
      'setting:gateway:blacklist:delete',
      'setting:gateway:blacklist:update',
      'setting:gateway:blacklist:read',
      'tools:crontab:create',
      'tools:crontab:delete',
      'tools:crontab:update',
      'tools:crontab:read',
      'tools:files:create',
      'tools:files:delete',
      'tools:files:update',
      'tools:files:read',
      'tools:recycle:delete',
      'tools:recycle:read',
      'web:menu:create',
      'web:menu:delete',
      'web:menu:update',
      'web:menu:read',
      'web:link:create',
      'web:link:delete',
      'web:link:update',
      'web:link:read',
      'monitor:logs:login:read',
      'monitor:logs:operate:read',
    ],
    username: 'vben',
  },
  {
    codes: [
      'AC_100010',
      'AC_100020',
      'AC_100030',
      'member:level:create',
      'member:level:delete',
      'member:level:update',
      'member:level:read',
      'member:user:create',
      'member:user:delete',
      'member:user:update',
      'member:user:read',
      'system:user:create',
      'system:user:delete',
      'system:user:update',
      'system:user:read',
      'system:role:create',
      'system:role:delete',
      'system:role:update',
      'system:role:read',
      'system:menu:create',
      'system:menu:delete',
      'system:menu:update',
      'system:menu:read',
      'setting:dict:create',
      'setting:dict:delete',
      'setting:dict:update',
      'setting:dict:read',
      'setting:dept:create',
      'setting:dept:delete',
      'setting:dept:update',
      'setting:dept:read',
      'setting:config:update',
      'setting:config:read',
    ],
    username: 'admin',
  },
  {
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const businessMenus = [
  {
    meta: {
      icon: 'lucide:users',
      order: 10,
      title: 'member.title',
    },
    name: 'Member',
    path: '/member',
    redirect: '/member/level',
    children: [
      {
        name: 'MemberLevel',
        path: '/member/level',
        component: '/member/level/index',
        meta: { icon: 'lucide:award', title: 'member.level.title' },
      },
      {
        name: 'MemberPoints',
        path: '/member/points',
        component: '/member/points/index',
        meta: { icon: 'lucide:coins', title: 'member.points.title' },
      },
      {
        name: 'MemberTag',
        path: '/member/tag',
        component: '/member/tag/index',
        meta: { icon: 'lucide:tag', title: 'member.tag.title' },
      },
      {
        name: 'MemberUser',
        path: '/member/user',
        component: '/member/user/index',
        meta: { icon: 'lucide:user', title: 'member.user.title' },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:activity',
      order: 20,
      title: 'monitor.title',
    },
    name: 'Monitor',
    path: '/monitor',
    redirect: '/monitor/logs/login',
    children: [
      {
        meta: { icon: 'lucide:file-text', title: 'monitor.logs.title' },
        name: 'MonitorLogs',
        path: '/monitor/logs',
        redirect: '/monitor/logs/login',
        children: [
          {
            name: 'LoginLog',
            path: '/monitor/logs/login',
            component: '/monitor/logs/login/index',
            meta: { icon: 'lucide:log-in', title: 'monitor.logs.login.title' },
          },
          {
            name: 'OperateLog',
            path: '/monitor/logs/operate',
            component: '/monitor/logs/operate/index',
            meta: {
              icon: 'lucide:clipboard-list',
              title: 'monitor.logs.operate.title',
            },
          },
        ],
      },
      {
        name: 'RedisMonitor',
        path: '/monitor/redis',
        component: '/monitor/redis/index',
        meta: { icon: 'lucide:database', title: 'monitor.redis.title' },
      },
      {
        name: 'ServerMonitor',
        path: '/monitor/server',
        component: '/monitor/server/index',
        meta: { icon: 'lucide:server', title: 'monitor.server.title' },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:settings',
      order: 30,
      title: 'setting.title',
    },
    name: 'Setting',
    path: '/setting',
    redirect: '/setting/config',
    children: [
      {
        name: 'SettingConfig',
        path: '/setting/config',
        component: '/setting/config/index',
        meta: { icon: 'lucide:wrench', title: 'setting.config.title' },
      },
      {
        name: 'SettingDept',
        path: '/setting/dept',
        component: '/setting/dept/index',
        meta: { icon: 'lucide:network', title: 'setting.dept.title' },
      },
      {
        name: 'SettingDict',
        path: '/setting/dict',
        component: '/setting/dict/index',
        meta: { icon: 'lucide:book-open', title: 'setting.dict.title' },
      },
      {
        name: 'SettingDictItem',
        path: '/setting/dict-item',
        component: '/setting/dict-item/index',
        meta: { icon: 'lucide:list', title: 'setting.dict.item.title' },
      },
      {
        meta: { icon: 'lucide:shield', title: 'setting.gateway.title' },
        name: 'SettingGateway',
        path: '/setting/gateway',
        redirect: '/setting/gateway/limiter',
        children: [
          {
            name: 'GatewayLimiter',
            path: '/setting/gateway/limiter',
            component: '/setting/gateway/limiter/index',
            meta: {
              icon: 'lucide:gauge',
              title: 'setting.gateway.limiter.title',
            },
          },
          {
            name: 'GatewayBlacklist',
            path: '/setting/gateway/blacklist',
            component: '/setting/gateway/blacklist/index',
            meta: {
              icon: 'lucide:ban',
              title: 'setting.gateway.blacklist.title',
            },
          },
        ],
      },
      {
        name: 'SettingMessage',
        path: '/setting/message',
        component: '/setting/message/index',
        meta: { icon: 'lucide:mail', title: 'setting.message.title' },
      },
      {
        name: 'SettingNotice',
        path: '/setting/notice',
        component: '/setting/notice/index',
        meta: { icon: 'lucide:megaphone', title: 'setting.notice.title' },
      },
      {
        name: 'SettingPost',
        path: '/setting/post',
        component: '/setting/post/index',
        meta: { icon: 'lucide:briefcase', title: 'setting.post.title' },
      },
      {
        name: 'SettingReview',
        path: '/setting/review',
        component: '/setting/review/index',
        meta: { icon: 'lucide:check-circle', title: 'setting.review.title' },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:cpu',
      order: 40,
      title: 'system.title',
    },
    name: 'System',
    path: '/system',
    redirect: '/system/menu',
    children: [
      {
        name: 'SystemMenu',
        path: '/system/menu',
        component: '/system/menu/index',
        meta: { icon: 'lucide:menu', title: 'system.menu.title' },
      },
      {
        name: 'SystemRole',
        path: '/system/role',
        component: '/system/role/index',
        meta: { icon: 'lucide:shield-check', title: 'system.role.title' },
      },
      {
        name: 'SystemUser',
        path: '/system/user',
        component: '/system/user/index',
        meta: { icon: 'lucide:users', title: 'system.user.title' },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:wrench',
      order: 50,
      title: 'tools.title',
    },
    name: 'Tools',
    path: '/tools',
    redirect: '/tools/crontab',
    children: [
      {
        name: 'ToolsCrontab',
        path: '/tools/crontab',
        component: '/tools/crontab/index',
        meta: { icon: 'lucide:clock', title: 'tools.crontab.title' },
      },
      {
        name: 'ToolsFiles',
        path: '/tools/files',
        component: '/tools/files/index',
        meta: { icon: 'lucide:folder', title: 'tools.files.title' },
      },
      {
        name: 'ToolsRecycle',
        path: '/tools/recycle',
        component: '/tools/recycle/index',
        meta: { icon: 'lucide:trash-2', title: 'tools.recycle.title' },
      },
      {
        name: 'ToolsDelegation',
        path: '/tools/delegation',
        component: '/tools/delegation/index',
        meta: { icon: 'lucide:key', title: 'tools.delegation.title' },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:globe',
      order: 60,
      title: 'web.title',
    },
    name: 'Web',
    path: '/web',
    redirect: '/web/link',
    children: [
      {
        name: 'WebLink',
        path: '/web/link',
        component: '/web/link/index',
        meta: { icon: 'lucide:link', title: 'web.link.title' },
      },
      {
        name: 'WebMenu',
        path: '/web/menu',
        component: '/web/menu/index',
        meta: { icon: 'lucide:layout-list', title: 'web.menu.title' },
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  const demoMenus = {
    meta: {
      icon: 'lucide:flask-conical',
      title: 'demo.menu.title',
    },
    name: 'Demo',
    path: '/demo',
    redirect: '/demo/crud/basic',
    children: [
      {
        meta: {
          icon: 'lucide:table',
          title: 'demo.menu.crud',
        },
        name: 'DemoCrud',
        path: '/demo/crud',
        redirect: '/demo/crud/basic',
        children: [
          {
            name: 'DemoCrudBasic',
            path: '/demo/crud/basic',
            component: 'crud/basic',
            meta: {
              icon: 'lucide:table-2',
              module: 'demo',
              title: 'demo.crud.basic.title',
            },
          },
          {
            name: 'DemoCrudTree',
            path: '/demo/crud/tree',
            component: 'crud/tree',
            meta: {
              icon: 'lucide:git-fork',
              module: 'demo',
              title: 'demo.crud.tree.title',
            },
          },
          {
            name: 'DemoCrudDrawer',
            path: '/demo/crud/drawer',
            component: 'crud/drawer',
            meta: {
              icon: 'lucide:panel-right',
              module: 'demo',
              title: 'demo.crud.drawer.title',
            },
          },
        ],
      },
      {
        meta: {
          icon: 'lucide:text-cursor-input',
          title: 'demo.menu.form',
        },
        name: 'DemoForm',
        path: '/demo/form',
        redirect: '/demo/form/overview',
        children: [
          {
            name: 'DemoFormOverview',
            path: '/demo/form/overview',
            component: 'form/overview',
            meta: {
              icon: 'lucide:text-cursor-input',
              module: 'demo',
              title: 'demo.form.overview.title',
            },
          },
          {
            name: 'DemoFormBasic',
            path: '/demo/form/basic',
            component: 'form/basic',
            meta: { module: 'demo', title: 'demo.form.basic.title' },
          },
          {
            name: 'DemoFormQuery',
            path: '/demo/form/query',
            component: 'form/query',
            meta: { module: 'demo', title: 'demo.form.query.title' },
          },
          {
            name: 'DemoFormRules',
            path: '/demo/form/rules',
            component: 'form/rules',
            meta: { module: 'demo', title: 'demo.form.rules.title' },
          },
          {
            name: 'DemoFormDynamic',
            path: '/demo/form/dynamic',
            component: 'form/dynamic',
            meta: { module: 'demo', title: 'demo.form.dynamic.title' },
          },
          {
            name: 'DemoFormApi',
            path: '/demo/form/api',
            component: 'form/api',
            meta: { module: 'demo', title: 'demo.form.api.title' },
          },
          {
            name: 'DemoFormMerge',
            path: '/demo/form/merge',
            component: 'form/merge',
            meta: { module: 'demo', title: 'demo.form.merge.title' },
          },
          {
            name: 'DemoFormCustomLayout',
            path: '/demo/form/custom-layout',
            component: 'form/custom-layout',
            meta: { module: 'demo', title: 'demo.form.custom_layout.title' },
          },
        ],
      },
      {
        name: 'DemoLocale',
        path: '/demo/locale',
        component: 'locale/index',
        meta: {
          icon: 'lucide:languages',
          module: 'demo',
          title: 'demo.locale.title',
        },
      },
      {
        meta: {
          icon: 'system-uicons:window-content',
          module: 'demo',
          title: 'demo.modal.title',
          keepAlive: true,
        },
        name: 'DemoModal',
        path: '/demo/modal',
        component: 'modal/index',
      },
      {
        meta: {
          icon: 'iconoir:drawer',
          module: 'demo',
          title: 'demo.drawer.title',
          keepAlive: true,
        },
        name: 'DemoDrawer',
        path: '/demo/drawer',
        component: 'drawer/index',
      },
      {
        meta: {
          icon: 'lucide:table',
          title: 'demo.menu.vxe_table',
        },
        name: 'DemoVxeTable',
        path: '/demo/vxe-table',
        redirect: '/demo/vxe-table/basic',
        children: [
          {
            name: 'DemoVxeTableBasic',
            path: '/demo/vxe-table/basic',
            component: 'vxe-table/basic',
            meta: { module: 'demo', title: 'demo.vxe_table.basic.title' },
          },
          {
            name: 'DemoVxeTableRemote',
            path: '/demo/vxe-table/remote',
            component: 'vxe-table/remote',
            meta: { module: 'demo', title: 'demo.vxe_table.remote.title' },
          },
          {
            name: 'DemoVxeTableTree',
            path: '/demo/vxe-table/tree',
            component: 'vxe-table/tree',
            meta: { module: 'demo', title: 'demo.vxe_table.tree.title' },
          },
          {
            name: 'DemoVxeTableCustomCell',
            path: '/demo/vxe-table/custom-cell',
            component: 'vxe-table/custom-cell',
            meta: { module: 'demo', title: 'demo.vxe_table.custom_cell.title' },
          },
          {
            name: 'DemoVxeTableEditCell',
            path: '/demo/vxe-table/edit-cell',
            component: 'vxe-table/edit-cell',
            meta: { module: 'demo', title: 'demo.vxe_table.edit_cell.title' },
          },
          {
            name: 'DemoVxeTableEditRow',
            path: '/demo/vxe-table/edit-row',
            component: 'vxe-table/edit-row',
            meta: { module: 'demo', title: 'demo.vxe_table.edit_row.title' },
          },
          {
            name: 'DemoVxeTableFixed',
            path: '/demo/vxe-table/fixed',
            component: 'vxe-table/fixed',
            meta: { module: 'demo', title: 'demo.vxe_table.fixed.title' },
          },
          {
            name: 'DemoVxeTableForm',
            path: '/demo/vxe-table/form',
            component: 'vxe-table/form',
            meta: { module: 'demo', title: 'demo.vxe_table.form.title' },
          },
          {
            name: 'DemoVxeTableVirtual',
            path: '/demo/vxe-table/virtual',
            component: 'vxe-table/virtual',
            meta: { module: 'demo', title: 'demo.vxe_table.virtual.title' },
          },
        ],
      },
      {
        name: 'DemoCaptcha',
        path: '/demo/captcha',
        component: 'captcha/slider-captcha',
        meta: {
          icon: 'logos:recaptcha',
          module: 'demo',
          title: 'demo.captcha.title',
        },
      },
      {
        name: 'DemoEllipsis',
        path: '/demo/ellipsis',
        component: 'ellipsis/index',
        meta: {
          icon: 'ion:ellipsis-horizontal',
          module: 'demo',
          title: 'demo.ellipsis.title',
        },
      },
      {
        name: 'DemoJsonViewer',
        path: '/demo/json-viewer',
        component: 'json-viewer/index',
        meta: {
          icon: 'tabler:json',
          module: 'demo',
          title: 'demo.json_viewer.title',
        },
      },
      {
        name: 'DemoLoading',
        path: '/demo/loading',
        component: 'loading/index',
        meta: {
          icon: 'mdi:circle-double',
          module: 'demo',
          title: 'demo.loading.title',
        },
      },
      {
        name: 'DemoCountTo',
        path: '/demo/count-to',
        component: 'count-to/index',
        meta: {
          icon: 'mdi:animation-play',
          module: 'demo',
          title: 'demo.count_to.title',
        },
      },
      {
        name: 'DemoCropper',
        path: '/demo/cropper',
        component: 'cropper/index',
        meta: { icon: 'mdi:crop', module: 'demo', title: 'demo.cropper.title' },
      },
      {
        name: 'DemoContextMenu',
        path: '/demo/context-menu',
        component: 'context-menu/index',
        meta: {
          icon: 'mdi:menu',
          module: 'demo',
          title: 'demo.context_menu.title',
        },
      },
      {
        name: 'DemoResize',
        path: '/demo/resize',
        component: 'resize/basic',
        meta: {
          icon: 'material-symbols:resize',
          module: 'demo',
          title: 'demo.resize.title',
        },
      },
      {
        name: 'DemoTippy',
        path: '/demo/tippy',
        component: 'tippy/index',
        meta: {
          icon: 'mdi:message-settings-outline',
          module: 'demo',
          title: 'demo.tippy.title',
        },
      },
      {
        name: 'DemoTiptap',
        path: '/demo/tiptap',
        component: 'tiptap/index',
        meta: {
          icon: 'lucide:square-pen',
          module: 'demo',
          title: 'demo.tiptap.title',
        },
      },
      {
        name: 'DemoMotion',
        path: '/demo/motion',
        component: 'motion/index',
        meta: {
          icon: 'mdi:animation-play',
          module: 'demo',
          title: 'demo.motion.title',
        },
      },
    ],
  };

  return [
    // {
    //   meta: {
    //     icon: 'ic:baseline-view-in-ar',
    //     keepAlive: true,
    //     order: 1000,
    //     title: 'demos.title',
    //   },
    //   name: 'Demos',
    //   path: '/demos',
    //   redirect: '/demos/access',
    //   children: [
    //     {
    //       name: 'AccessDemos',
    //       path: '/demosaccess',
    //       meta: {
    //         icon: 'mdi:cloud-key-outline',
    //         title: 'demos.access.backendPermissions',
    //       },
    //       redirect: '/demos/access/page-control',
    //       children: [
    //         {
    //           name: 'AccessPageControlDemo',
    //           path: '/demos/access/page-control',
    //           component: '/demos/access/index',
    //           meta: {
    //             icon: 'mdi:page-previous-outline',
    //             title: 'demos.access.pageAccess',
    //           },
    //         },
    //         {
    //           name: 'AccessButtonControlDemo',
    //           path: '/demos/access/button-control',
    //           component: '/demos/access/button-control',
    //           meta: {
    //             icon: 'mdi:button-cursor',
    //             title: 'demos.access.buttonControl',
    //           },
    //         },
    //         {
    //           name: 'AccessMenuVisible403Demo',
    //           path: '/demos/access/menu-visible-403',
    //           component: '/demos/access/menu-visible-403',
    //           meta: {
    //             authority: ['no-body'],
    //             icon: 'mdi:button-cursor',
    //             menuVisibleWithForbidden: true,
    //             title: 'demos.access.menuVisible403',
    //           },
    //         },
    //         roleWithMenus[role],
    //       ],
    //     },
    //   ],
    // },
    demoMenus,
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus],
    username: 'vben',
  },
  // {
  //   menus: [...dashboardMenus, ...businessMenus, ...createDemosMenus('super')],
  //   username: 'vben',
  // },
  // {
  //   menus: [...dashboardMenus, ...businessMenus, ...createDemosMenus('admin')],
  //   username: 'admin',
  // },
  // {
  //   menus: [...dashboardMenus, ...businessMenus, ...createDemosMenus('user')],
  //   username: 'jack',
  // },
];

export const MOCK_MENU_LIST = [
  {
    id: 1,
    name: 'Workspace',
    status: 1,
    type: 'menu',
    icon: 'mdi:dashboard',
    path: '/workspace',
    component: '/dashboard/workspace/index',
    meta: {
      icon: 'carbon:workspace',
      title: 'page.dashboard.workspace',
      affixTab: true,
      order: 0,
    },
  },
  {
    id: 2,
    meta: {
      icon: 'carbon:settings',
      order: 9997,
      title: 'system.title',
      badge: 'new',
      badgeType: 'normal',
      badgeVariants: 'primary',
    },
    status: 1,
    type: 'catalog',
    name: 'System',
    path: '/system',
    children: [
      {
        id: 201,
        pid: 2,
        path: '/system/menu',
        name: 'SystemMenu',
        authCode: 'System:Menu:List',
        status: 1,
        type: 'menu',
        meta: {
          icon: 'carbon:menu',
          title: 'system.menu.title',
        },
        component: '/system/menu/list',
        children: [
          {
            id: 20_101,
            pid: 201,
            name: 'SystemMenuCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_102,
            pid: 201,
            name: 'SystemMenuEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_103,
            pid: 201,
            name: 'SystemMenuDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
      {
        id: 202,
        pid: 2,
        path: '/system/dept',
        name: 'SystemDept',
        status: 1,
        type: 'menu',
        authCode: 'System:Dept:List',
        meta: {
          icon: 'carbon:container-services',
          title: 'system.dept.title',
        },
        component: '/system/dept/list',
        children: [
          {
            id: 20_401,
            pid: 202,
            name: 'SystemDeptCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_402,
            pid: 202,
            name: 'SystemDeptEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_403,
            pid: 202,
            name: 'SystemDeptDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
    ],
  },
  {
    id: 9,
    meta: {
      badgeType: 'dot',
      order: 9998,
      title: 'demos.vben.title',
      icon: 'carbon:data-center',
    },
    name: 'Project',
    path: '/vben-admin',
    type: 'catalog',
    status: 1,
    children: [
      {
        id: 901,
        pid: 9,
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        type: 'embedded',
        status: 1,
        meta: {
          icon: 'carbon:book',
          iframeSrc: 'https://doc.vben.pro',
          title: 'demos.vben.document',
        },
      },
      {
        id: 902,
        pid: 9,
        name: 'VbenGithub',
        path: '/vben-admin/github',
        component: 'IFrameView',
        type: 'link',
        status: 1,
        meta: {
          icon: 'carbon:logo-github',
          link: 'https://github.com/vbenjs/vue-vben-admin',
          title: 'Github',
        },
      },
      {
        id: 903,
        pid: 9,
        name: 'VbenAntdv',
        path: '/vben-admin/antdv',
        component: 'IFrameView',
        type: 'link',
        status: 0,
        meta: {
          icon: 'carbon:hexagon-vertical-solid',
          badgeType: 'dot',
          link: 'https://ant.vben.pro',
          title: 'demos.vben.antdv',
        },
      },
    ],
  },
  {
    id: 10,
    component: '_core/about/index',
    type: 'menu',
    status: 1,
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: 'demos.vben.about',
    },
    name: 'About',
    path: '/about',
  },
];

// ==================== 插件模块菜单模拟数据 ====================
// 用于测试 meta.module 和模板页面加载机制

/**
 * 插件菜单配置（统一完整路径格式）
 *
 * component 统一使用完整路径：/plugins/{module}/views/{page}
 * 通过 meta.module 字段区分是哪个模块的组件
 *
 * 示例：
 * - component: '/plugins/demo/views/about/test'
 * - meta.module: 'demo'
 */
const pluginMenus = [
  // {
  //   id: 1000,
  //   name: '插件管理',
  //   path: '/plugin',
  //   type: 'catalog',
  //   status: 1,
  //   meta: {
  //     icon: 'lucide:box',
  //     order: 100,
  //     title: '插件管理',
  //     badge: '新',
  //     badgeType: 'normal',
  //   },
  //   children: [
  //     // ==================== 问答模块 ====================
  //     // {
  //     //   id: 1010,
  //     //   pid: 1000,
  //     //   name: '问答管理',
  //     //   path: '/plugin/ask',
  //     //   type: 'catalog',
  //     //   status: 1,
  //     //   meta: {
  //     //     icon: 'lucide:message-square',
  //     //     title: '问答管理',
  //     //     module: 'ask',
  //     //   },
  //     //   children: [
  //     //     {
  //     //       id: 1011,
  //     //       pid: 1010,
  //     //       name: '问题列表',
  //     //       path: '/plugin/ask/question',
  //     //       component: '/plugins/ask/views/question/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:list',
  //     //         title: '问题列表',
  //     //         module: 'ask',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //     {
  //     //       id: 1012,
  //     //       pid: 1010,
  //     //       name: '分类管理',
  //     //       path: '/plugin/ask/category',
  //     //       component: '/plugins/ask/views/category/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:folder-tree',
  //     //         title: '分类管理',
  //     //         module: 'ask',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //     {
  //     //       id: 1013,
  //     //       pid: 1010,
  //     //       name: '标签管理',
  //     //       path: '/plugin/ask/tag',
  //     //       component: '/plugins/ask/views/tag/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:tags',
  //     //         title: '标签管理',
  //     //         module: 'ask',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //   ],
  //     // },
  //     // // ==================== 文档模块 ====================
  //     // {
  //     //   id: 1020,
  //     //   pid: 1000,
  //     //   name: '文档管理',
  //     //   path: '/plugin/doc',
  //     //   type: 'catalog',
  //     //   status: 1,
  //     //   meta: {
  //     //     icon: 'lucide:file-text',
  //     //     title: '文档管理',
  //     //     module: 'doc',
  //     //   },
  //     //   children: [
  //     //     {
  //     //       id: 1021,
  //     //       pid: 1020,
  //     //       name: '文档列表',
  //     //       path: '/plugin/doc/item',
  //     //       component: '/plugins/doc/views/item/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:files',
  //     //         title: '文档列表',
  //     //         module: 'doc',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //     {
  //     //       id: 1022,
  //     //       pid: 1020,
  //     //       name: '文档分类',
  //     //       path: '/plugin/doc/category',
  //     //       component: '/plugins/doc/views/category/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:folder',
  //     //         title: '文档分类',
  //     //         module: 'doc',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //     {
  //     //       id: 1023,
  //     //       pid: 1020,
  //     //       name: '文档权限',
  //     //       path: '/plugin/doc/permission',
  //     //       component: '/plugins/doc/views/permission',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:shield',
  //     //         title: '文档权限',
  //     //         module: 'doc',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //   ],
  //     // },
  //     // // ==================== 应用市场 ====================
  //     // {
  //     //   id: 1030,
  //     //   pid: 1000,
  //     //   name: '应用市场',
  //     //   path: '/plugin/market',
  //     //   type: 'catalog',
  //     //   status: 1,
  //     //   meta: {
  //     //     icon: 'lucide:shopping-bag',
  //     //     title: '应用市场',
  //     //     module: 'market',
  //     //   },
  //     //   children: [
  //     //     {
  //     //       id: 1031,
  //     //       pid: 1030,
  //     //       name: '应用列表',
  //     //       path: '/plugin/market/apps',
  //     //       component: '/plugins/market/views/apps/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:app-window',
  //     //         title: '应用列表',
  //     //         module: 'market',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //     {
  //     //       id: 1032,
  //     //       pid: 1030,
  //     //       name: '应用分类',
  //     //       path: '/plugin/market/category',
  //     //       component: '/plugins/market/views/category/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:layout-grid',
  //     //         title: '应用分类',
  //     //         module: 'market',
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //   ],
  //     // },
  //     // // ==================== 通用 CRUD 模板测试 ====================
  //     // {
  //     //   id: 1040,
  //     //   pid: 1000,
  //     //   name: '模板演示',
  //     //   path: '/plugin/template',
  //     //   type: 'catalog',
  //     //   status: 1,
  //     //   meta: {
  //     //     icon: 'lucide:layout-template',
  //     //     title: '模板演示',
  //     //     module: 'template',
  //     //   },
  //     //   children: [
  //     //     {
  //     //       id: 1041,
  //     //       pid: 1040,
  //     //       name: 'CRUD列表',
  //     //       path: '/plugin/template/crud-list',
  //     //       component: '/views/templates/crud/list',
  //     //       type: 'menu',
  //     //       status: 1,
  //     //       meta: {
  //     //         icon: 'lucide:table',
  //     //         title: 'CRUD列表',
  //     //         module: 'template',
  //     //         templateOptions: {
  //     //           api: {
  //     //             list: '/api/table/list',
  //     //             create: '/api/table/create',
  //     //             update: '/api/table/update',
  //     //             delete: '/api/table/delete',
  //     //           },
  //     //           columns: [
  //     //             { title: 'ID', dataIndex: 'id', key: 'id' },
  //     //             { title: '名称', dataIndex: 'name', key: 'name' },
  //     //             { title: '状态', dataIndex: 'status', key: 'status' },
  //     //             { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  //     //           ],
  //     //         },
  //     //         keepAlive: true,
  //     //       },
  //     //     },
  //     //   ],
  //     // },
  //     // ==================== Demo 插件测试（最简格式！） ====================
  //     {
  //       id: 1050,
  //       pid: 1000,
  //       name: '插件演示',
  //       path: '/plugin/demo/about',
  //       // ⭐ 最简写法：只写相对路径
  //       component: 'about/test',
  //       type: 'menu',
  //       status: 1,
  //       meta: {
  //         icon: 'lucide:info',
  //         title: '插件演示',
  //         // ⭐ 通过 module 标识，自动定位到插件目录
  //         module: 'demo',
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       id: 1051,
  //       pid: 1000,
  //       name: '插件首页',
  //       path: '/plugin/demo/home',
  //       // ⭐ 最简写法：只写相对路径
  //       component: 'home/test2',
  //       type: 'menu',
  //       status: 1,
  //       meta: {
  //         icon: 'lucide:home',
  //         title: '插件首页',
  //         // ⭐ 通过 module 标识，自动定位到插件目录
  //         module: 'demo',
  //         keepAlive: true,
  //       },
  //     },
  //   ],
  // },
];

/**
 * 获取插件菜单（用于测试）
 */
export function getPluginMenus() {
  return pluginMenus;
}

/**
 * 将后端菜单格式转换为前端路由格式
 * 移除 id、pid、status、type 等后端特有字段
 */
function convertToRouteFormat(menu: any): any {
  const { id, pid, status, type, authCode, children, ...rest } = menu;
  const route: any = { ...rest };

  // 递归处理子菜单
  if (children && children.length > 0) {
    route.children = children.map(convertToRouteFormat);
  }

  return route;
}

/**
 * 获取插件菜单（前端路由格式）
 */
export function getPluginMenusAsRoutes() {
  return pluginMenus.map(convertToRouteFormat);
}

/**
 * 获取包含插件菜单的完整菜单列表
 */
export function getMenusWithPlugins() {
  return [...(MOCK_MENU_LIST as any), ...pluginMenus];
}

export function getMenuIds(menus: any[]) {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids.push(...getMenuIds(item.children));
    }
  });
  return ids;
}

/**
 * 时区选项
 */
export const TIME_ZONE_OPTIONS: TimezoneOption[] = [
  {
    offset: -5,
    timezone: 'America/New_York',
  },
  {
    offset: 0,
    timezone: 'Europe/London',
  },
  {
    offset: 8,
    timezone: 'Asia/Shanghai',
  },
  {
    offset: 9,
    timezone: 'Asia/Tokyo',
  },
  {
    offset: 9,
    timezone: 'Asia/Seoul',
  },
];
