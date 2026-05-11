import type { CrudSchema } from '#/adapter/crud'

import { RecycleBinService } from '#/api/tools'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: RecycleBinService.list,
      remove: RecycleBinService.remove,
      view: RecycleBinService.get,
    },
    dialogTitle: $t('tools.recycle.title'),
    useCrud: true,
    hasAdd: false,
    hasRemove: true,
    hasEdit: false,
    hasView: true,
    removeAuth: 'tools:recycle:delete',
    viewAuth: 'tools:recycle:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('tools.recycle.table.columns.id'), minWidth: 60, visible: false },
      { field: 'data', title: $t('tools.recycle.table.columns.data'), minWidth: 200 },
      { field: 'table_name', title: $t('tools.recycle.table.columns.table_name'), minWidth: 120 },
      { field: 'table_prefix', title: $t('tools.recycle.table.columns.table_prefix'), minWidth: 100 },
      { field: 'ip', title: $t('tools.recycle.table.columns.ip'), minWidth: 120 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_table_name',
        label: $t('tools.recycle.search.table_name'),
        component: 'Input',
      },
    ],
    formSchema: [],
    dialogWidth: '40%',
  }
}
