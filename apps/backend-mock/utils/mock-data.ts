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
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
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

  return [
    {
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus, ...createDemosMenus('super')],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('admin')],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('user')],
    username: 'jack',
  },
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
  {
    id: 1000,
    name: '插件管理',
    path: '/plugin',
    type: 'catalog',
    status: 1,
    meta: {
      icon: 'lucide:box',
      order: 100,
      title: '插件管理',
      badge: '新',
      badgeType: 'normal',
    },
    children: [
      // ==================== 问答模块 ====================
      // {
      //   id: 1010,
      //   pid: 1000,
      //   name: '问答管理',
      //   path: '/plugin/ask',
      //   type: 'catalog',
      //   status: 1,
      //   meta: {
      //     icon: 'lucide:message-square',
      //     title: '问答管理',
      //     module: 'ask',
      //   },
      //   children: [
      //     {
      //       id: 1011,
      //       pid: 1010,
      //       name: '问题列表',
      //       path: '/plugin/ask/question',
      //       component: '/plugins/ask/views/question/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:list',
      //         title: '问题列表',
      //         module: 'ask',
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       id: 1012,
      //       pid: 1010,
      //       name: '分类管理',
      //       path: '/plugin/ask/category',
      //       component: '/plugins/ask/views/category/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:folder-tree',
      //         title: '分类管理',
      //         module: 'ask',
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       id: 1013,
      //       pid: 1010,
      //       name: '标签管理',
      //       path: '/plugin/ask/tag',
      //       component: '/plugins/ask/views/tag/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:tags',
      //         title: '标签管理',
      //         module: 'ask',
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },

      // // ==================== 文档模块 ====================
      // {
      //   id: 1020,
      //   pid: 1000,
      //   name: '文档管理',
      //   path: '/plugin/doc',
      //   type: 'catalog',
      //   status: 1,
      //   meta: {
      //     icon: 'lucide:file-text',
      //     title: '文档管理',
      //     module: 'doc',
      //   },
      //   children: [
      //     {
      //       id: 1021,
      //       pid: 1020,
      //       name: '文档列表',
      //       path: '/plugin/doc/item',
      //       component: '/plugins/doc/views/item/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:files',
      //         title: '文档列表',
      //         module: 'doc',
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       id: 1022,
      //       pid: 1020,
      //       name: '文档分类',
      //       path: '/plugin/doc/category',
      //       component: '/plugins/doc/views/category/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:folder',
      //         title: '文档分类',
      //         module: 'doc',
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       id: 1023,
      //       pid: 1020,
      //       name: '文档权限',
      //       path: '/plugin/doc/permission',
      //       component: '/plugins/doc/views/permission',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:shield',
      //         title: '文档权限',
      //         module: 'doc',
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },

      // // ==================== 应用市场 ====================
      // {
      //   id: 1030,
      //   pid: 1000,
      //   name: '应用市场',
      //   path: '/plugin/market',
      //   type: 'catalog',
      //   status: 1,
      //   meta: {
      //     icon: 'lucide:shopping-bag',
      //     title: '应用市场',
      //     module: 'market',
      //   },
      //   children: [
      //     {
      //       id: 1031,
      //       pid: 1030,
      //       name: '应用列表',
      //       path: '/plugin/market/apps',
      //       component: '/plugins/market/views/apps/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:app-window',
      //         title: '应用列表',
      //         module: 'market',
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       id: 1032,
      //       pid: 1030,
      //       name: '应用分类',
      //       path: '/plugin/market/category',
      //       component: '/plugins/market/views/category/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:layout-grid',
      //         title: '应用分类',
      //         module: 'market',
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },

      // // ==================== 通用 CRUD 模板测试 ====================
      // {
      //   id: 1040,
      //   pid: 1000,
      //   name: '模板演示',
      //   path: '/plugin/template',
      //   type: 'catalog',
      //   status: 1,
      //   meta: {
      //     icon: 'lucide:layout-template',
      //     title: '模板演示',
      //     module: 'template',
      //   },
      //   children: [
      //     {
      //       id: 1041,
      //       pid: 1040,
      //       name: 'CRUD列表',
      //       path: '/plugin/template/crud-list',
      //       component: '/views/templates/crud/list',
      //       type: 'menu',
      //       status: 1,
      //       meta: {
      //         icon: 'lucide:table',
      //         title: 'CRUD列表',
      //         module: 'template',
      //         templateOptions: {
      //           api: {
      //             list: '/api/table/list',
      //             create: '/api/table/create',
      //             update: '/api/table/update',
      //             delete: '/api/table/delete',
      //           },
      //           columns: [
      //             { title: 'ID', dataIndex: 'id', key: 'id' },
      //             { title: '名称', dataIndex: 'name', key: 'name' },
      //             { title: '状态', dataIndex: 'status', key: 'status' },
      //             { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
      //           ],
      //         },
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },

      // ==================== Demo 插件测试（最简格式！） ====================
      {
        id: 1050,
        pid: 1000,
        name: '插件演示',
        path: '/plugin/demo/about',
        // ⭐ 最简写法：只写相对路径
        component: 'about/test',
        type: 'menu',
        status: 1,
        meta: {
          icon: 'lucide:info',
          title: '插件演示',
          // ⭐ 通过 module 标识，自动定位到插件目录
          module: 'demo',
          keepAlive: true,
        },
      },
      {
        id: 1051,
        pid: 1000,
        name: '插件首页',
        path: '/plugin/demo/home',
        // ⭐ 最简写法：只写相对路径
        component: 'home/test2',
        type: 'menu',
        status: 1,
        meta: {
          icon: 'lucide:home',
          title: '插件首页',
          // ⭐ 通过 module 标识，自动定位到插件目录
          module: 'demo',
          keepAlive: true,
        },
      },
    ],
  },
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
