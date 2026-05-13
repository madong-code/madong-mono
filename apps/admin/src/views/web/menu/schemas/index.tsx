import type { CrudSchema } from '#/components/crud/components/types'

import { WebMenuService } from '#/api/web'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: WebMenuService.list,
    add: WebMenuService.create,
    edit: WebMenuService.update,
    remove: WebMenuService.remove,
    view: WebMenuService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'web:menu:create',
      edit: 'web:menu:update',
      remove: 'web:menu:delete',
      view: 'web:menu:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('web.menu.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('web.menu.table.columns.name'), minWidth: 120 },
      {
        field: 'category',
        title: $t('web.menu.table.columns.category'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.WEB_MENU_CATEGORY },
      },
      { field: 'url', title: $t('web.menu.table.columns.url'), minWidth: 200 },
      { field: 'sort', title: $t('web.menu.table.columns.sort'), minWidth: 80 },
      {
        field: 'type',
        title: $t('web.menu.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.WEB_MENU_TYPE },
      },
      {
        field: 'enabled',
        title: $t('web.menu.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_name',
        label: $t('web.menu.search.name'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_category',
        label: $t('web.menu.search.category'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.WEB_MENU_CATEGORY, clearable: true },
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('web.menu.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'name', label: $t('web.menu.form.name'), component: 'Input', rules: 'required' },
      {
        fieldName: 'type',
        label: $t('web.menu.form.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.WEB_MENU_TYPE, clearable: true },
      },
      { fieldName: 'pid', label: $t('web.menu.form.pid'), component: 'TreeSelect', componentProps: { code: 'web_menu', clearable: true } },
      { fieldName: 'url', label: $t('web.menu.form.url'), component: 'Input' },
      {
        fieldName: 'target',
        label: $t('web.menu.form.target'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.WEB_MENU_TARGET, clearable: true },
      },
      { fieldName: 'icon', label: $t('web.menu.form.icon'), component: 'IconPicker' },
      { fieldName: 'sort', label: $t('web.menu.form.sort'), component: 'InputNumber', defaultValue: 0, componentProps: { min: 0, precision: 0 } },
      {
        fieldName: 'enabled',
        label: $t('web.menu.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    title: $t('web.menu.title'),
    width: 'w-[40%]',
  },
}
