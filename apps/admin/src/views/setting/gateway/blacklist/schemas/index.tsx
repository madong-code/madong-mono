import type { CrudSchema } from '#/adapter/crud'

import { GatewayBlacklistService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: GatewayBlacklistService.list,
      add: GatewayBlacklistService.create,
      edit: GatewayBlacklistService.update,
      remove: GatewayBlacklistService.remove,
      view: GatewayBlacklistService.get,
    },
    dialogTitle: $t('setting.gateway.blacklist.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'setting:blacklist:create',
    removeAuth: 'setting:blacklist:delete',
    editAuth: 'setting:blacklist:update',
    viewAuth: 'setting:blacklist:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.gateway.blacklist.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('setting.gateway.blacklist.table.columns.name'), minWidth: 120 },
      { field: 'ip', title: $t('setting.gateway.blacklist.table.columns.ip'), minWidth: 120 },
      { field: 'path', title: $t('setting.gateway.blacklist.table.columns.path'), minWidth: 150 },
      { field: 'methods', title: $t('setting.gateway.blacklist.table.columns.methods'), minWidth: 100 },
      {
        field: 'enabled',
        title: $t('setting.gateway.blacklist.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'start_date', title: $t('setting.gateway.blacklist.table.columns.start_date'), minWidth: 160 },
      { field: 'end_date', title: $t('setting.gateway.blacklist.table.columns.end_date'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_name',
        label: $t('setting.gateway.blacklist.search.name'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('setting.gateway.blacklist.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'name', label: $t('setting.gateway.blacklist.form.name'), component: 'Input', rules: 'required' },
      { fieldName: 'ip', label: $t('setting.gateway.blacklist.form.ip'), component: 'Input', rules: 'required' },
      { fieldName: 'path', label: $t('setting.gateway.blacklist.form.path'), component: 'Input' },
      { fieldName: 'methods', label: $t('setting.gateway.blacklist.form.methods'), component: 'Input' },
      {
        fieldName: 'enabled',
        label: $t('setting.gateway.blacklist.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      { fieldName: 'start_date', label: $t('setting.gateway.blacklist.form.start_date'), component: 'DatePicker' },
      { fieldName: 'end_date', label: $t('setting.gateway.blacklist.form.end_date'), component: 'DatePicker' },
      { fieldName: 'remark', label: $t('setting.gateway.blacklist.form.remark'), component: 'Input', componentProps: { type: 'textarea', rows: 3 } },
    ],
    dialogWidth: '40%',
  }
}
