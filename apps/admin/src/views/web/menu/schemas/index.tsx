import type { CrudSchema } from '#/adapter/crud'

import { WebMenuService } from '#/api/web'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: WebMenuService.list,
      add: WebMenuService.create,
      edit: WebMenuService.update,
      remove: WebMenuService.remove,
      view: WebMenuService.get,
    },
    dialogTitle: $t('web.menu.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'web:menu:create',
    removeAuth: 'web:menu:delete',
    editAuth: 'web:menu:update',
    viewAuth: 'web:menu:read',
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
    searchFormSchema: [
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
    formSchema: [
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
    dialogWidth: '40%',
  }
}
