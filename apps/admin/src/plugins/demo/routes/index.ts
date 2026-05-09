/**
 * 插件路由完整测试用例（目录模式）
 * 覆盖所有支持的特性
 */
export default [
  // ==============================================
  // 1. 纯前端路由测试（组件为函数）
  // ==============================================
  {
    path: '/demo/frontend-test',
    name: 'DemoFrontendTest',
    component: () => import('../views/frontend-test/index.vue'), // 路径已调整，../返回上一级
    meta: {
      title: '前端路由测试',
      icon: 'el-icon-document',
      menuVisible: true,
      keepAlive: true,
    },
  },
  {
    path: '/demo/settings',
    name: 'DemoSettings',
    component: () => import('../views/settings/index.vue'), // 路径已调整
    meta: {
      title: '插件设置',
      icon: 'el-icon-setting',
      menuVisible: true,
    },
  },
  // 纯前端路由，不显示在菜单
  {
    path: '/demo/frontend-hidden',
    name: 'DemoFrontendHidden',
    component: () => import('../views/frontend-test/index.vue'), // 路径已调整
    meta: {
      title: '前端隐藏路由',
      menuVisible: false,
    },
  },

  // ==============================================
  // 2. 后端格式路由测试（组件为字符串）
  // ==============================================
    {
    path: '/demo/lang-test',
    name: 'DemoLangTest',
    component:'/lang-test',
    meta: {
      title: '多语言测试',
      icon: 'el-icon-language',
      menuVisible: true,
    },
  },
  {
    path: '/demo/backend-test',
    name: 'DemoBackendTest',
    component: 'backend-test', // ✅ 最简写法，自动补全 demo/views/backend-test/index.vue
    sort: 100, // 自定义排序，值越小越靠前
    meta: {
      title: '后端路由测试',
      icon: 'el-icon-menu',
      // 👍 不需要手动写module: 'demo'，自动识别
      menuVisible: true,
      permission: ['demo:backend:view'], // 权限控制
    },
  },
  // 后端模式语言包测试路由
  {
    path: '/demo/locale-backend-test',
    name: 'DemoLocaleBackendTest',
    component: 'locale-backend-test', // ✅ 最简写法，自动补全 demo/views/locale-backend-test/index.vue
    sort: 103,
    meta: {
      title: '后端语言包测试',
      icon: 'el-icon-globe',
      // 👍 不需要手动写module: 'demo'，自动识别
      menuVisible: true,
      permission: ['demo:locale:view'], // 权限控制
    },
  },
  {
    path: '/demo/data-list',
    name: 'DemoDataList',
    component: 'data-list', // ✅ 最简写法，自动补全 demo/views/data-list/index.vue
    sort: 101,
    meta: {
      title: '数据列表',
      icon: 'el-icon-list',
      // 👍 不需要手动写module: 'demo'，自动识别
      menuVisible: true,
      permission: ['demo:data:list'],
    },
    // 嵌套子路由测试
    children: [
      {
        path: 'detail/:id',
        name: 'DemoDataDetail',
        component: 'data-list/detail', // ✅ 子目录写法，自动补全 demo/views/data-list/detail.vue
        meta: {
          title: '数据详情',
          // 👍 子路由自动继承父级模块，不需要手动写
          menuVisible: false,
          permission: ['demo:data:detail'],
        },
      },
      {
        path: 'edit/:id',
        name: 'DemoDataEdit',
        component: 'data-list', // ✅ 最简写法，自动补全 demo/views/data-list/index.vue
        meta: {
          title: '编辑数据',
          // 👍 子路由自动继承父级模块，不需要手动写
          menuVisible: false,
          permission: ['demo:data:edit'],
        },
      },
    ],
  },
  // 后端路由，带分组
  {
    path: '/demo/group',
    name: 'DemoGroup',
    component: 'BasicLayout', // 使用布局组件
    sort: 102,
    meta: {
      title: '插件分组',
      icon: 'el-icon-folder',
      menuVisible: true,
    },
    children: [
      {
        path: 'page1',
        name: 'DemoGroupPage1',
        component: 'backend-test', // ✅ 最简写法
        meta: {
          title: '分组页面1',
          // 👍 子路由自动继承模块
          menuVisible: true,
        },
      },
      {
        path: 'page2',
        name: 'DemoGroupPage2',
        component: 'backend-test/index', // ✅ 带index的写法，效果一样
        meta: {
          title: '分组页面2',
          // 👍 子路由自动继承模块
          menuVisible: true,
        },
      },
    ],
  },
]
