import type { CrudSchema } from '#/components/crud/components/types';

import { FilesService } from '#/api/devtools';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: FilesService.list,
      add: FilesService.create,
      edit: FilesService.update,
      remove: FilesService.delete,
      batchRemove: FilesService.remove,
      view: FilesService.get,
    },
    // ========== 扁平化表格配置 ==========
    hasAdd: false,
    hasEdit: false,
    hasView: false,
    hasRemove: false,
    permissions: {
      add: 'upload:files:create',
      edit: 'upload:files:update',
      remove: 'upload:files:delete',
      view: 'upload:files:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'filename',
        title: $t('tools.files.table.columns.filename'),
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'original_filename',
        title: $t('tools.files.table.columns.original_filename'),
        width: 200,
      },
      {
        field: 'size_info',
        title: $t('tools.files.table.columns.size_info'),
        minWidth: 100,
      },
      { field: 'ext', title: $t('tools.files.table.columns.ext'), width: 80 },
      {
        field: 'platform',
        title: $t('tools.files.table.columns.platform'),
        minWidth: 100,
      },
      {
        field: 'created_date',
        title: $t('tools.files.table.columns.created_date'),
        width: 170,
      },
      {
        field: 'created_name',
        title: $t('tools.files.table.columns.created_name'),
        minWidth: 100,
      },
    ],
    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_filename',
          label: $t('tools.files.table.search.filename'),
        },
        {
          component: 'Input',
          fieldName: 'LIKE_original_filename',
          label: $t('tools.files.table.search.original_filename'),
        },
        {
          component: 'Input',
          fieldName: 'LIKE_ext',
          label: $t('tools.files.table.search.ext'),
        },
        {
          component: 'Input',
          fieldName: 'IN_platform',
          label: $t('tools.files.table.search.platform'),
        },
      ],
    },
    formDialog: { enabled: false, schema: [] },
  };
};
