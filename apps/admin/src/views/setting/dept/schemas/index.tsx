import type { CrudSchema } from '#/components/crud/components/types'

import { DeptService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: DeptService.list,
    add: DeptService.create,
    edit: DeptService.update,
    remove: DeptService.remove,
    view: DeptService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'setting:dept:create',
      edit: 'setting:dept:update',
      remove: 'setting:dept:delete',
      view: 'setting:dept:read',
    },
    tree: { id: 'id', pid: 'pid', children: 'children' },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.dept.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('setting.dept.table.columns.name'), minWidth: 150, treeNode: true },
      { field: 'code', title: $t('setting.dept.table.columns.code'), minWidth: 100 },
      { field: 'phone', title: $t('setting.dept.table.columns.phone'), minWidth: 120 },
      { field: 'sort', title: $t('setting.dept.table.columns.sort'), minWidth: 80 },
      {
        field: 'enabled',
        title: $t('setting.dept.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'remark', title: $t('setting.dept.table.columns.remark'), minWidth: 160 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_name',
        label: $t('setting.dept.search.name'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('setting.dept.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      {
        fieldName: 'pid',
        label: $t('setting.dept.form.pid'),
        component: 'TreeSelect',
        componentProps: { code: 'dept', clearable: true },
      },
      {
        fieldName: 'name',
        label: $t('setting.dept.form.name'),
        component: 'Input',
        rules: 'required',
      },
      {
        fieldName: 'code',
        label: $t('setting.dept.form.code'),
        component: 'Input',
      },
      {
        fieldName: 'phone',
        label: $t('setting.dept.form.phone'),
        component: 'Input',
      },
      {
        fieldName: 'sort',
        label: $t('setting.dept.form.sort'),
        component: 'InputNumber',
        defaultValue: 0,
        componentProps: { min: 0, precision: 0 },
      },
      {
        fieldName: 'enabled',
        label: $t('setting.dept.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'remark',
        label: $t('setting.dept.form.remark'),
        component: 'Input',
        componentProps: { type: 'textarea', rows: 3 },
      },
    ],
    title: $t('setting.dept.title'),
    width: 'w-[40%]',
  },
}
