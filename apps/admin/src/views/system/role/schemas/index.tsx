import type { CrudSchema } from '#/adapter/crud'

import { RoleService } from '#/api/system'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: RoleService.list,
      add: RoleService.create,
      edit: RoleService.update,
      remove: RoleService.remove,
      view: RoleService.get,
    },
    dialogTitle: $t('system.role.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'system:role:create',
    removeAuth: 'system:role:delete',
    editAuth: 'system:role:update',
    viewAuth: 'system:role:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('system.role.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('system.role.table.columns.name'), minWidth: 120 },
      { field: 'code', title: $t('system.role.table.columns.code'), minWidth: 120 },
      {
        field: 'role_type',
        title: $t('system.role.table.columns.role_type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ROLE_TYPE },
      },
      {
        field: 'data_scope',
        title: $t('system.role.table.columns.data_scope'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_DATA_PERMISSION },
      },
      {
        field: 'enabled',
        title: $t('system.role.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'sort', title: $t('system.role.table.columns.sort'), minWidth: 60 },
      { field: 'remark', title: $t('system.role.table.columns.remark'), minWidth: 160 },
      { field: 'created_date', title: $t('system.role.table.columns.created_date'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_name',
        label: $t('system.role.search.name'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('system.role.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'name', label: $t('system.role.form.name'), component: 'Input', rules: 'required' },
      { fieldName: 'code', label: $t('system.role.form.code'), component: 'Input', rules: 'required' },
      {
        fieldName: 'role_type',
        label: $t('system.role.form.role_type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ROLE_TYPE, clearable: true },
      },
      {
        fieldName: 'data_scope',
        label: $t('system.role.form.data_scope'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_DATA_PERMISSION, clearable: true },
      },
      { fieldName: 'sort', label: $t('system.role.form.sort'), component: 'InputNumber', defaultValue: 0, componentProps: { min: 0, precision: 0 } },
      {
        fieldName: 'enabled',
        label: $t('system.role.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      { fieldName: 'remark', label: $t('system.role.form.remark'), component: 'Input', componentProps: { type: 'textarea', rows: 3 } },
    ],
    dialogWidth: '40%',
  }
}
