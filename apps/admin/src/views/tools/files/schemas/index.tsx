import type { CrudSchema } from '#/adapter/crud'

import { FilesService } from '#/api/tools'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: FilesService.list,
      add: FilesService.create,
      edit: FilesService.update,
      remove: FilesService.remove,
      view: FilesService.get,
    },
    dialogTitle: $t('tools.files.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: false,
    hasView: true,
    addAuth: 'tools:files:upload',
    removeAuth: 'tools:files:delete',
    viewAuth: 'tools:files:read',
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
    searchFormSchema: [
      {
        fieldName: 'LIKE_original_filename',
        label: $t('tools.files.search.original_filename'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'file', label: $t('tools.files.form.file'), component: 'Upload', rules: 'required' },
    ],
    dialogWidth: '40%',
  }
}
