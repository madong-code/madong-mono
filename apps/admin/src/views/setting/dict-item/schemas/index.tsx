import type { CrudSchema } from '#/components/crud/components/types'

import { DictItemService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: DictItemService.list,
    add: DictItemService.create,
    edit: DictItemService.update,
    remove: DictItemService.remove,
    view: DictItemService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'setting:dictItem:create',
      edit: 'setting:dictItem:update',
      remove: 'setting:dictItem:delete',
      view: 'setting:dictItem:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.dict.item.table.columns.id'), minWidth: 60, visible: false },
      { field: 'label', title: $t('setting.dict.item.table.columns.label'), minWidth: 120 },
      { field: 'value', title: $t('setting.dict.item.table.columns.value'), minWidth: 100 },
      { field: 'code', title: $t('setting.dict.item.table.columns.code'), minWidth: 100 },
      { field: 'sort', title: $t('setting.dict.item.table.columns.sort'), minWidth: 80 },
      {
        field: 'enabled',
        title: $t('setting.dict.item.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'remark', title: $t('setting.dict.item.table.columns.remark'), minWidth: 160 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_label',
        label: $t('setting.dict.item.search.label'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('setting.dict.item.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'label',
        label: $t('setting.dict.item.form.label'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'value',
        label: $t('setting.dict.item.form.value'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'code',
        label: $t('setting.dict.item.form.code'),
        component: 'Input',
      },
      {
        fieldName: 'sort',
        label: $t('setting.dict.item.form.sort'),
        component: 'InputNumber',
        defaultValue: 0,
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'enabled',
        label: $t('setting.dict.item.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'remark',
        label: $t('setting.dict.item.form.remark'),
        component: 'Input',
        componentProps: { type: 'textarea', rows: 3 },
      },
    ],
    title: $t('setting.dict.item.title'),
    width: 'w-[40%]',
  },
}
