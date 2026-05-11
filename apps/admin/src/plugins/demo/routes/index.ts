import { $t } from '#/locales';

export default [
  {
    path: '/demo/crud/basic',
    name: 'DemoCrudBasic',
    component: () => import('../views/crud/basic.vue'),
    meta: {
      title: $t('demo.crud.basic.title'),
      icon: 'lucide:table-2',
    },
  },
  {
    path: '/demo/crud/tree',
    name: 'DemoCrudTree',
    component: () => import('../views/crud/tree.vue'),
    meta: {
      title: $t('demo.crud.tree.title'),
      icon: 'lucide:git-fork',
    },
  },
  {
    path: '/demo/crud/drawer',
    name: 'DemoCrudDrawer',
    component: () => import('../views/crud/drawer.vue'),
    meta: {
      title: $t('demo.crud.drawer.title'),
      icon: 'lucide:panel-right',
    },
  },
  {
    path: '/demo/form/overview',
    name: 'DemoFormOverview',
    component: () => import('../views/form/overview.vue'),
    meta: {
      title: $t('demo.form.overview.title'),
      icon: 'lucide:text-cursor-input',
    },
  },
  {
    path: '/demo/form/basic',
    name: 'DemoFormBasic',
    component: () => import('../views/form/basic.vue'),
    meta: {
      title: $t('demo.form.basic.title'),
    },
  },
  {
    path: '/demo/form/query',
    name: 'DemoFormQuery',
    component: () => import('../views/form/query.vue'),
    meta: {
      title: $t('demo.form.query.title'),
    },
  },
  {
    path: '/demo/form/rules',
    name: 'DemoFormRules',
    component: () => import('../views/form/rules.vue'),
    meta: {
      title: $t('demo.form.rules.title'),
    },
  },
  {
    path: '/demo/form/dynamic',
    name: 'DemoFormDynamic',
    component: () => import('../views/form/dynamic.vue'),
    meta: {
      title: $t('demo.form.dynamic.title'),
    },
  },
  {
    path: '/demo/form/api',
    name: 'DemoFormApi',
    component: () => import('../views/form/api.vue'),
    meta: {
      title: $t('demo.form.api.title'),
    },
  },
  {
    path: '/demo/form/merge',
    name: 'DemoFormMerge',
    component: () => import('../views/form/merge.vue'),
    meta: {
      title: $t('demo.form.merge.title'),
    },
  },
  {
    path: '/demo/form/custom-layout',
    name: 'DemoFormCustomLayout',
    component: () => import('../views/form/custom-layout.vue'),
    meta: {
      title: $t('demo.form.custom_layout.title'),
    },
  },
  {
    path: '/demo/locale',
    name: 'DemoLocale',
    component: () => import('../views/locale/index.vue'),
    meta: {
      title: $t('demo.locale.title'),
      icon: 'lucide:languages',
    },
  },
  {
    path: '/demo/modal',
    name: 'DemoModal',
    component: () => import('../views/modal/index.vue'),
    meta: {
      title: $t('demo.modal.title'),
      icon: 'system-uicons:window-content',
      keepAlive: true,
    },
  },
  {
    path: '/demo/drawer',
    name: 'DemoDrawer',
    component: () => import('../views/drawer/index.vue'),
    meta: {
      title: $t('demo.drawer.title'),
      icon: 'iconoir:drawer',
      keepAlive: true,
    },
  },
  {
    path: '/demo/vxe-table/basic',
    name: 'DemoVxeTableBasic',
    component: () => import('../views/vxe-table/basic.vue'),
    meta: {
      title: $t('demo.vxe_table.basic.title'),
      icon: 'lucide:table',
    },
  },
  {
    path: '/demo/vxe-table/remote',
    name: 'DemoVxeTableRemote',
    component: () => import('../views/vxe-table/remote.vue'),
    meta: {
      title: $t('demo.vxe_table.remote.title'),
    },
  },
  {
    path: '/demo/vxe-table/tree',
    name: 'DemoVxeTableTree',
    component: () => import('../views/vxe-table/tree.vue'),
    meta: {
      title: $t('demo.vxe_table.tree.title'),
    },
  },
  {
    path: '/demo/vxe-table/custom-cell',
    name: 'DemoVxeTableCustomCell',
    component: () => import('../views/vxe-table/custom-cell.vue'),
    meta: {
      title: $t('demo.vxe_table.custom_cell.title'),
    },
  },
  {
    path: '/demo/vxe-table/edit-cell',
    name: 'DemoVxeTableEditCell',
    component: () => import('../views/vxe-table/edit-cell.vue'),
    meta: {
      title: $t('demo.vxe_table.edit_cell.title'),
    },
  },
  {
    path: '/demo/vxe-table/edit-row',
    name: 'DemoVxeTableEditRow',
    component: () => import('../views/vxe-table/edit-row.vue'),
    meta: {
      title: $t('demo.vxe_table.edit_row.title'),
    },
  },
  {
    path: '/demo/vxe-table/fixed',
    name: 'DemoVxeTableFixed',
    component: () => import('../views/vxe-table/fixed.vue'),
    meta: {
      title: $t('demo.vxe_table.fixed.title'),
    },
  },
  {
    path: '/demo/vxe-table/form',
    name: 'DemoVxeTableForm',
    component: () => import('../views/vxe-table/form.vue'),
    meta: {
      title: $t('demo.vxe_table.form.title'),
    },
  },
  {
    path: '/demo/vxe-table/virtual',
    name: 'DemoVxeTableVirtual',
    component: () => import('../views/vxe-table/virtual.vue'),
    meta: {
      title: $t('demo.vxe_table.virtual.title'),
    },
  },
  {
    path: '/demo/captcha',
    name: 'DemoCaptcha',
    component: () => import('../views/captcha/slider-captcha.vue'),
    meta: {
      title: $t('demo.captcha.title'),
      icon: 'logos:recaptcha',
    },
  },
  {
    path: '/demo/ellipsis',
    name: 'DemoEllipsis',
    component: () => import('../views/ellipsis/index.vue'),
    meta: {
      title: $t('demo.ellipsis.title'),
      icon: 'ion:ellipsis-horizontal',
    },
  },
  {
    path: '/demo/json-viewer',
    name: 'DemoJsonViewer',
    component: () => import('../views/json-viewer/index.vue'),
    meta: {
      title: $t('demo.json_viewer.title'),
      icon: 'tabler:json',
    },
  },
  {
    path: '/demo/loading',
    name: 'DemoLoading',
    component: () => import('../views/loading/index.vue'),
    meta: {
      title: $t('demo.loading.title'),
      icon: 'mdi:circle-double',
    },
  },
  {
    path: '/demo/count-to',
    name: 'DemoCountTo',
    component: () => import('../views/count-to/index.vue'),
    meta: {
      title: $t('demo.count_to.title'),
      icon: 'mdi:animation-play',
    },
  },
  {
    path: '/demo/cropper',
    name: 'DemoCropper',
    component: () => import('../views/cropper/index.vue'),
    meta: {
      title: $t('demo.cropper.title'),
      icon: 'mdi:crop',
    },
  },
  {
    path: '/demo/context-menu',
    name: 'DemoContextMenu',
    component: () => import('../views/context-menu/index.vue'),
    meta: {
      title: $t('demo.context_menu.title'),
      icon: 'mdi:menu',
    },
  },
  {
    path: '/demo/resize',
    name: 'DemoResize',
    component: () => import('../views/resize/basic.vue'),
    meta: {
      title: $t('demo.resize.title'),
      icon: 'material-symbols:resize',
    },
  },
  {
    path: '/demo/tippy',
    name: 'DemoTippy',
    component: () => import('../views/tippy/index.vue'),
    meta: {
      title: $t('demo.tippy.title'),
      icon: 'mdi:message-settings-outline',
    },
  },
  {
    path: '/demo/tiptap',
    name: 'DemoTiptap',
    component: () => import('../views/tiptap/index.vue'),
    meta: {
      title: $t('demo.tiptap.title'),
      icon: 'lucide:square-pen',
    },
  },
  {
    path: '/demo/motion',
    name: 'DemoMotion',
    component: () => import('../views/motion/index.vue'),
    meta: {
      title: $t('demo.motion.title'),
      icon: 'mdi:animation-play',
    },
  },
];
