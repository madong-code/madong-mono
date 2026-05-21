import type { CrudSchema } from '#/components/crud/components/types';
import { RecycleBinService } from '#/api/tools';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: RecycleBinService.list,
      add: RecycleBinService.create,
      edit: RecycleBinService.update,
      remove: RecycleBinService.delete,
      batchRemove: RecycleBinService.remove,
      view: RecycleBinService.get,
    },
    hasAdd: false,
    hasEdit: false,
    hasView: true,
    hasRemove: false,
    permissions: {
      add: 'system:recycle:create',
      edit: 'system:recycle:update',
      remove: 'system:recycle:delete',
      view: 'system:recycle:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'table_name', title: $t('tools.recycle.table.columns.table_name'), minWidth: 120 },
      { field: 'data', title: $t('tools.recycle.table.columns.data'), minWidth: 300 },
      { field: 'ip', title: 'IP', minWidth: 130 },
      { field: 'enabled', title: $t('tools.recycle.table.columns.enabled'), width: 90 },
      { field: 'created_date', title: $t('tools.recycle.table.columns.created_date'), width: 150},
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_table_name',
          label: $t('tools.recycle.table.search.table_name'),
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('tools.recycle.table.search.enabled'),
          componentProps: { code: DictEnum.SYS_YES_NO, clearable: true },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: $t('tools.recycle.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 100 },
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          fieldName: 'table_name',
          label: $t('tools.recycle.form.modal.table_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'operate_name',
          label: $t('tools.recycle.form.modal.operate_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip',
          label: $t('tools.recycle.form.modal.ip'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'created_date',
          label: $t('tools.recycle.form.modal.created_date'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'enabled',
          label: $t('tools.recycle.form.modal.enabled'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: { code: DictEnum.SYS_YES_NO, renderType: 'RadioGroup' },
        },
        {
          fieldName: 'data',
          label: $t('tools.recycle.form.modal.data'),
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 15 },
        },
      ],
    },
  };
};
