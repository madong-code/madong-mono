import type { CrudSchema } from '#/components/crud/components/types'

import { GatewayLimiterService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: GatewayLimiterService.list,
    add: GatewayLimiterService.create,
    edit: GatewayLimiterService.update,
    remove: GatewayLimiterService.remove,
    view: GatewayLimiterService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'setting:limiter:create',
      edit: 'setting:limiter:update',
      remove: 'setting:limiter:delete',
      view: 'setting:limiter:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.gateway.limiter.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('setting.gateway.limiter.table.columns.name'), minWidth: 120 },
      { field: 'ip', title: $t('setting.gateway.limiter.table.columns.ip'), minWidth: 120 },
      { field: 'path', title: $t('setting.gateway.limiter.table.columns.path'), minWidth: 150 },
      { field: 'methods', title: $t('setting.gateway.limiter.table.columns.methods'), minWidth: 100 },
      { field: 'limit_type', title: $t('setting.gateway.limiter.table.columns.limit_type'), minWidth: 100 },
      { field: 'limit_value', title: $t('setting.gateway.limiter.table.columns.limit_value'), minWidth: 80 },
      { field: 'period', title: $t('setting.gateway.limiter.table.columns.period'), minWidth: 80 },
      {
        field: 'enabled',
        title: $t('setting.gateway.limiter.table.columns.enabled'),
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
        label: $t('setting.gateway.limiter.search.name'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('setting.gateway.limiter.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'name', label: $t('setting.gateway.limiter.form.name'), component: 'Input', rules: 'required' },
      { fieldName: 'ip', label: $t('setting.gateway.limiter.form.ip'), component: 'Input' },
      { fieldName: 'path', label: $t('setting.gateway.limiter.form.path'), component: 'Input' },
      { fieldName: 'methods', label: $t('setting.gateway.limiter.form.methods'), component: 'Input' },
      { fieldName: 'limit_type', label: $t('setting.gateway.limiter.form.limit_type'), component: 'Input' },
      { fieldName: 'limit_value', label: $t('setting.gateway.limiter.form.limit_value'), component: 'InputNumber', componentProps: { min: 0 } },
      { fieldName: 'period', label: $t('setting.gateway.limiter.form.period'), component: 'InputNumber', componentProps: { min: 0 } },
      {
        fieldName: 'enabled',
        label: $t('setting.gateway.limiter.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      { fieldName: 'message', label: $t('setting.gateway.limiter.form.message'), component: 'Input' },
    ],
    title: $t('setting.gateway.limiter.title'),
    width: 'w-[40%]',
  },
}
