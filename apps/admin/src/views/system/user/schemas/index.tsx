import type { CrudSchema } from '#/adapter/crud'

import { UserService } from '#/api/system'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: UserService.list,
      add: UserService.create,
      edit: UserService.update,
      remove: UserService.remove,
      view: UserService.get,
    },
    dialogTitle: $t('system.user.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'system:user:create',
    removeAuth: 'system:user:delete',
    editAuth: 'system:user:update',
    viewAuth: 'system:user:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('system.user.table.columns.id'), minWidth: 60, visible: false },
      { field: 'user_name', title: $t('system.user.table.columns.user_name'), minWidth: 100 },
      { field: 'real_name', title: $t('system.user.table.columns.real_name'), minWidth: 100 },
      { field: 'nick_name', title: $t('system.user.table.columns.nick_name'), minWidth: 100 },
      { field: 'mobile_phone', title: $t('system.user.table.columns.mobile_phone'), minWidth: 120 },
      { field: 'email', title: $t('system.user.table.columns.email'), minWidth: 160 },
      {
        field: 'enabled',
        title: $t('system.user.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'login_time', title: $t('system.user.table.columns.login_time'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_user_name',
        label: $t('system.user.search.user_name'),
        component: 'Input',
      },
      {
        fieldName: 'LIKE_real_name',
        label: $t('system.user.search.real_name'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_enabled',
        label: $t('system.user.search.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, clearable: true },
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('system.user.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'user_name', label: $t('system.user.form.user_name'), component: 'Input', rules: 'required' },
      { fieldName: 'real_name', label: $t('system.user.form.real_name'), component: 'Input', rules: 'required' },
      { fieldName: 'nick_name', label: $t('system.user.form.nick_name'), component: 'Input' },
      { fieldName: 'mobile_phone', label: $t('system.user.form.mobile_phone'), component: 'Input' },
      { fieldName: 'email', label: $t('system.user.form.email'), component: 'Input' },
      { fieldName: 'password', label: $t('system.user.form.password'), component: 'Input', componentProps: { type: 'password', showPassword: true } },
      { fieldName: 'dept_id', label: $t('system.user.form.dept_id'), component: 'TreeSelect', componentProps: { code: 'dept', clearable: true } },
      {
        fieldName: 'enabled',
        label: $t('system.user.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      { fieldName: 'remark', label: $t('system.user.form.remark'), component: 'Input', componentProps: { type: 'textarea', rows: 3 } },
    ],
    dialogWidth: '40%',
  }
}
