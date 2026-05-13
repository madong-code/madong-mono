import type { CrudSchema } from '#/components/crud/components/types'

import { RecycleBinService } from '#/api/tools'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: RecycleBinService.list,
    remove: RecycleBinService.remove,
    view: RecycleBinService.get,
  },

  // 表格配置
  table: {
    hasAdd: false,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      remove: 'tools:recycle:delete',
      view: 'tools:recycle:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('tools.recycle.table.columns.id'), minWidth: 60, visible: false },
      { field: 'data', title: $t('tools.recycle.table.columns.data'), minWidth: 200 },
      { field: 'table_name', title: $t('tools.recycle.table.columns.table_name'), minWidth: 120 },
      { field: 'table_prefix', title: $t('tools.recycle.table.columns.table_prefix'), minWidth: 100 },
      { field: 'ip', title: $t('tools.recycle.table.columns.ip'), minWidth: 120 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_table_name',
        label: $t('tools.recycle.search.table_name'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: false,
    schema: [],
    title: $t('tools.recycle.title'),
    width: 'w-[40%]',
  },
}
