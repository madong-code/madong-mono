import type { RouteRecordStringComponent } from '@vben/types';

import { $t } from '#/locales';

/** 插件路由定义类型：component 可选，无 component 但有 children 时自动渲染为 RouterView 容器 */
type PluginRoute = Omit<
  RouteRecordStringComponent,
  'children' | 'component'
> & {
  children?: PluginRoute[];
  component?: string;
};

const routes: PluginRoute[] = [
  {
    path: '/demo',
    name: 'DemoRoot',
    component: 'BasicLayout',
    redirect: '/demo/crud/basic',
    meta: {
      title: $t('demo.menu.title'),
      icon: 'lucide:boxes',
      order: 9999,
      module: 'demo',
    },
    children: [
      // ===================== CRUD 示例 =====================
      {
        path: '/demo/crud',
        name: 'DemoCrudGroup',
        redirect: '/demo/crud/basic',
        meta: {
          title: $t('demo.menu.crud'),
          icon: 'lucide:table-2',
          module: 'demo',
        },
        children: [
          {
            path: '/demo/crud/basic',
            name: 'DemoCrudBasic',
            component: '/crud/basic',
            meta: {
              title: $t('demo.crud.basic.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/crud/tree',
            name: 'DemoCrudTree',
            component: 'crud/tree',
            meta: {
              title: $t('demo.crud.tree.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/crud/drawer',
            name: 'DemoCrudDrawer',
            component: 'crud/drawer',
            meta: {
              title: $t('demo.crud.drawer.title'),
              module: 'demo',
            },
          },
        ],
      },
      // ===================== 表单示例 =====================
      {
        path: '/demo/form',
        name: 'DemoFormGroup',
        redirect: '/demo/form/overview',
        meta: {
          title: $t('demo.menu.form'),
          icon: 'lucide:text-cursor-input',
          module: 'demo',
        },
        children: [
          {
            path: '/demo/form/overview',
            name: 'DemoFormOverview',
            component: 'form/overview',
            meta: {
              title: $t('demo.form.overview.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/basic',
            name: 'DemoFormBasic',
            component: 'form/basic',
            meta: {
              title: $t('demo.form.basic.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/query',
            name: 'DemoFormQuery',
            component: 'form/query',
            meta: {
              title: $t('demo.form.query.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/rules',
            name: 'DemoFormRules',
            component: 'form/rules',
            meta: {
              title: $t('demo.form.rules.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/dynamic',
            name: 'DemoFormDynamic',
            component: 'form/dynamic',
            meta: {
              title: $t('demo.form.dynamic.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/api',
            name: 'DemoFormApi',
            component: 'form/api',
            meta: {
              title: $t('demo.form.api.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/merge',
            name: 'DemoFormMerge',
            component: 'form/merge',
            meta: {
              title: $t('demo.form.merge.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/form/custom-layout',
            name: 'DemoFormCustomLayout',
            component: 'form/custom-layout',
            meta: {
              title: $t('demo.form.custom_layout.title'),
              module: 'demo',
            },
          },
        ],
      },
      // ===================== Vxe 表格 =====================
      {
        path: '/demo/vxe-table',
        name: 'DemoVxeTableGroup',
        redirect: '/demo/vxe-table/basic',
        meta: {
          title: $t('demo.menu.vxe_table'),
          icon: 'lucide:table',
          module: 'demo',
        },
        children: [
          {
            path: '/demo/vxe-table/basic',
            name: 'DemoVxeTableBasic',
            component: 'vxe-table/basic',
            meta: {
              title: $t('demo.vxe_table.basic.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/remote',
            name: 'DemoVxeTableRemote',
            component: 'vxe-table/remote',
            meta: {
              title: $t('demo.vxe_table.remote.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/tree',
            name: 'DemoVxeTableTree',
            component: 'vxe-table/tree',
            meta: {
              title: $t('demo.vxe_table.tree.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/custom-cell',
            name: 'DemoVxeTableCustomCell',
            component: 'vxe-table/custom-cell',
            meta: {
              title: $t('demo.vxe_table.custom_cell.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/edit-cell',
            name: 'DemoVxeTableEditCell',
            component: 'vxe-table/edit-cell',
            meta: {
              title: $t('demo.vxe_table.edit_cell.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/edit-row',
            name: 'DemoVxeTableEditRow',
            component: 'vxe-table/edit-row',
            meta: {
              title: $t('demo.vxe_table.edit_row.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/fixed',
            name: 'DemoVxeTableFixed',
            component: 'vxe-table/fixed',
            meta: {
              title: $t('demo.vxe_table.fixed.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/form',
            name: 'DemoVxeTableForm',
            component: 'vxe-table/form',
            meta: {
              title: $t('demo.vxe_table.form.title'),
              module: 'demo',
            },
          },
          {
            path: '/demo/vxe-table/virtual',
            name: 'DemoVxeTableVirtual',
            component: 'vxe-table/virtual',
            meta: {
              title: $t('demo.vxe_table.virtual.title'),
              module: 'demo',
            },
          },
        ],
      },
      // ===================== 表单设计 =====================
      {
        path: '/demo/form-builder',
        name: 'DemoFormBuilder',
        component: 'visual-form/builder/index',
        meta: {
          title: $t('demo.form_builder.title'),
          module: 'demo',
        },
      },
      // ===================== 通用组件 =====================
      {
        path: '/demo/locale',
        name: 'DemoLocale',
        component: 'locale/index',
        meta: {
          title: $t('demo.locale.title'),
          icon: 'lucide:languages',
          module: 'demo',
        },
      },
      {
        path: '/demo/modal',
        name: 'DemoModal',
        component: 'modal/index',
        meta: {
          title: $t('demo.modal.title'),
          keepAlive: true,
          module: 'demo',
        },
      },
      {
        path: '/demo/drawer',
        name: 'DemoDrawer',
        component: 'drawer/index',
        meta: {
          title: $t('demo.drawer.title'),
          keepAlive: true,
          module: 'demo',
        },
      },
      {
        path: '/demo/captcha',
        name: 'DemoCaptcha',
        component: 'captcha/slider-captcha',
        meta: {
          title: $t('demo.captcha.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/ellipsis',
        name: 'DemoEllipsis',
        component: 'ellipsis/index',
        meta: {
          title: $t('demo.ellipsis.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/json-viewer',
        name: 'DemoJsonViewer',
        component: 'json-viewer/index',
        meta: {
          title: $t('demo.json_viewer.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/loading',
        name: 'DemoLoading',
        component: 'loading/index',
        meta: {
          title: $t('demo.loading.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/count-to',
        name: 'DemoCountTo',
        component: 'count-to/index',
        meta: {
          title: $t('demo.count_to.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/cropper',
        name: 'DemoCropper',
        component: 'cropper/index',
        meta: {
          title: $t('demo.cropper.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/context-menu',
        name: 'DemoContextMenu',
        component: 'context-menu/index',
        meta: {
          title: $t('demo.context_menu.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/resize',
        name: 'DemoResize',
        component: 'resize/basic',
        meta: {
          title: $t('demo.resize.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/tippy',
        name: 'DemoTippy',
        component: 'tippy/index',
        meta: {
          title: $t('demo.tippy.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/tiptap',
        name: 'DemoTiptap',
        component: 'tiptap/index',
        meta: {
          title: $t('demo.tiptap.title'),
          module: 'demo',
        },
      },
      {
        path: '/demo/motion',
        name: 'DemoMotion',
        component: 'motion/index',
        meta: {
          title: $t('demo.motion.title'),
          module: 'demo',
        },
      },
    ],
  },
];

export default routes;
