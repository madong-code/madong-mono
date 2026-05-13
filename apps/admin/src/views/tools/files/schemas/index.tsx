import type { CrudSchema } from '#/components/crud/components/types'

import { FilesService } from '#/api/tools'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: FilesService.list,
    add: FilesService.create,
    edit: FilesService.update,
    remove: FilesService.remove,
    view: FilesService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'tools:files:upload',
      remove: 'tools:files:delete',
      view: 'tools:files:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('tools.files.table.columns.id'), minWidth: 60, visible: false },
      { field: 'original_filename', title: $t('tools.files.table.columns.original_filename'), minWidth: 150 },
      { field: 'url', title: $t('tools.files.table.columns.url'), minWidth: 200, viewComponent: 'CellImage' },
      { field: 'size_info', title: $t('tools.files.table.columns.size_info'), minWidth: 80 },
      { field: 'ext', title: $t('tools.files.table.columns.ext'), minWidth: 60 },
      { field: 'content_type', title: $t('tools.files.table.columns.content_type'), minWidth: 120 },
      { field: 'platform', title: $t('tools.files.table.columns.platform'), minWidth: 80 },
      { field: 'created_at', title: $t('tools.files.table.columns.created_at'), minWidth: 160 },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_original_filename',
        label: $t('tools.files.search.original_filename'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'file', label: $t('tools.files.form.file'), component: 'Upload', rules: 'required' },
    ],
    title: $t('tools.files.title'),
    width: 'w-[40%]',
  },
}
