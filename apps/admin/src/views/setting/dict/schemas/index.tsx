import type { CrudSchema } from '#/components/crud/components/types'

import { DictService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: DictService.list,
    add: DictService.create,
    edit: DictService.update,
    remove: DictService.remove,
    view: DictService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'setting:dict:create',
      edit: 'setting:dict:update',
      remove: 'setting:dict:delete',
      view: 'setting:dict:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.dict.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('setting.dict.table.columns.name'), minWidth: 120 },
      { field: 'code', title: $t('setting.dict.table.columns.code'), minWidth: 150 },
      { field: 'group_code', title: $t('setting.dict.table.columns.group_code'), minWidth: 120 },
      {
        field: 'data_type',
        title: $t('setting.dict.table.columns.data_type'),
        minWidth: 100,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_DICT_DATA_TYPE },
      },
      {
        field: 'enabled',
        title: $t('setting.dict.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'sort', title: $t('setting.dict.table.columns.sort'), minWidth: 80 },
      { field: 'description', title: $t('setting.dict.table.columns.description'), minWidth: 160 },
    ],
    tableActions: [
      {
        label: $t('setting.dict.table.actions.dict_item'),
        icon: 'ant-design:unordered-list-outlined',
        type: 'primary',
        link: true,
        onClick: ({ row }: any) => {
          dictItemDrawerOpener.open(row)
        },
      },
    ],
    dropDownActions: [
      {
        label: $t('setting.dict.table.actions.edit'),
        icon: 'ant-design:edit-outlined',
        auth: 'setting:dict:update',
        onClick: ({ row, crudApi }: any) => {
          crudApi.openEditDialog(row)
        },
      },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_name',
        label: $t('setting.dict.search.name'),
        component: 'Input',
      },
      {
        fieldName: 'LIKE_code',
        label: $t('setting.dict.search.code'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('setting.dict.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'name',
        label: $t('setting.dict.form.name'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'code',
        label: $t('setting.dict.form.code'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'group_code',
        label: $t('setting.dict.form.group_code'),
        component: 'Input',
      },
      {
        fieldName: 'data_type',
        label: $t('setting.dict.form.data_type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_DICT_DATA_TYPE, clearable: true },
      },
      {
        fieldName: 'enabled',
        label: $t('setting.dict.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'sort',
        label: $t('setting.dict.form.sort'),
        component: 'InputNumber',
        defaultValue: 0,
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'description',
        label: $t('setting.dict.form.description'),
        component: 'Input',
        componentProps: { type: 'textarea', rows: 3 },
      },
    ],
    title: $t('setting.dict.title'),
    width: 'w-[40%]',
  },
}

export const dictItemDrawerOpener = { open: (_row: any) => {} }
