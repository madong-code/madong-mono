import type { RouteRecordStringComponent } from '@vben/types';

/**
 * 后端模式路由定义
 *
 * 此文件专门用于定义后端菜单模式下的前端路由。
 * 路由使用字符串形式的 component，由后端菜单系统动态加载。
 *
 * 路由特点：
 * - component 为字符串路径，如 'views/system/user-center/index.vue'
 * - hideInMenu: true 表示不在前端菜单中显示，但可通过URL访问
 * - 无需在前端静态路由中重复定义
 */
const backendRoutes: RouteRecordStringComponent[] = [
  /**
   * 个人中心路由
   * 后端菜单模式下，此路由由后端菜单系统管理
   * 前端仅定义路由入口，不显示在侧边菜单
   */
  {
    name: 'Profile',
    path: '/profile',
    component: 'views/_core/profile/index',
    meta: {
      hideInMenu: true,
      hideInBreadcrumb: false,
      title: '个人中心',
      module: 'system',
    },
  },
  {
    name: 'ConfigCommon',
    path: '/system/config-common',
    component: 'views/system/config/components/common',
    meta: {
      hideInMenu: true,
      hideInBreadcrumb: false,
      title: '通用配置',
      module: 'system',
    },
  },

  // ========== 临时路由：应用管理模块 ==========
  // TODO: 开发完成后删除，菜单由后端 admin.php 配置接管
  {
    name: 'APPTest',
    path: '/app',
    component: 'BasicLoyout',
    meta: {
      title: '应用管理',
    },
    children: [
      {
        name: 'AppPluginMarket1',
        path: '/app/plugin/market',
        component: 'views/app/plugin/market/index',
        meta: {
          title: '模块市场',
        },
      },
      {
        name: 'AppPluginDevelop1',
        path: '/app/plugin/develop',
        component: 'views/app/plugin/develop/index',
        meta: {
          title: '插件开发',
        },
      },
      {
        name: 'AppGenerator',
        path: '/app/generator',
        component: 'views/app/generator/index',
        meta: {
          title: '代码生成',
        },
      },
      {
        name: 'AppGeneratorCode',
        path: '/app/generator/code',
        component: 'views/app/generator/generator',
        meta: {
          hideInMenu: true,
          title: '代码生成编辑',
        },
      },
      {
        name: 'AppPluginDelegation1',
        path: '/app/plugin/delegation',
        component: 'views/app/plugin/delegation/index',
        meta: {
          title: '授权信息',
        },
      },
    ],
  },
];

export default backendRoutes;
