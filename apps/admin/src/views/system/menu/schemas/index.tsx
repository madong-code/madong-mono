import type { CrudSchema } from '#/adapter/crud'

import { MenuService } from '#/api/system'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MenuService.list,
      add: MenuService.create,
      edit: MenuService.update,
      remove: MenuService.remove,
      view: MenuService.get,
    },
    dialogTitle: $t('system.menu.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'system:menu:create',
    removeAuth: 'system:menu:delete',
    editAuth: 'system:menu:update',
    viewAuth: 'system:menu:read',
    tree: { id: 'id', pid: 'pid', children: 'children' },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('system.menu.table.columns.id'), minWidth: 60, visible: false },
      { field: 'title', title: $t('system.menu.table.columns.title'), minWidth: 150, treeNode: true },
      { field: 'code', title: $t('system.menu.table.columns.code'), minWidth: 120 },
      {
        field: 'type',
        title: $t('system.menu.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MENU_TYPE },
      },
      { field: 'path', title: $t('system.menu.table.columns.path'), minWidth: 150 },
      { field: 'component', title: $t('system.menu.table.columns.component'), minWidth: 150 },
      { field: 'icon', title: $t('system.menu.table.columns.icon'), minWidth: 80 },
      { field: 'sort', title: $t('system.menu.table.columns.sort'), minWidth: 60 },
      {
        field: 'is_show',
        title: $t('system.menu.table.columns.is_show'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_YES_NO },
      },
      {
        field: 'enabled',
        title: $t('system.menu.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_title',
        label: $t('system.menu.search.title'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('system.menu.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'pid', label: $t('system.menu.form.pid'), component: 'TreeSelect', componentProps: { code: 'menu', clearable: true } },
      { fieldName: 'title', label: $t('system.menu.form.title'), component: 'Input', rules: 'required' },
      { fieldName: 'code', label: $t('system.menu.form.code'), component: 'Input', rules: 'required' },
      {
        fieldName: 'type',
        label: $t('system.menu.form.type'),
        component: 'ApiDict',
        rules: 'required',
        componentProps: { code: DictEnum.SYS_MENU_TYPE, clearable: true },
      },
      { fieldName: 'path', label: $t('system.menu.form.path'), component: 'Input' },
      { fieldName: 'component', label: $t('system.menu.form.component'), component: 'Input' },
      { fieldName: 'icon', label: $t('system.menu.form.icon'), component: 'IconPicker' },
      { fieldName: 'sort', label: $t('system.menu.form.sort'), component: 'InputNumber', defaultValue: 0, componentProps: { min: 0, precision: 0 } },
      {
        fieldName: 'is_show',
        label: $t('system.menu.form.is_show'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_YES_NO, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'enabled',
        label: $t('system.menu.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'is_cache',
        label: $t('system.menu.form.is_cache'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_YES_NO, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 0,
      },
    ],
    dialogWidth: '50%',
  }
}
