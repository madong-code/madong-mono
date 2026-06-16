import type { CrudSchema } from '#/adapter/crud';

import { GeneratorCodeService } from '#/api/app/generator';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => ({
  rowKey: 'id',
  crudApi: {
    list: (params) => GeneratorCodeService.getList(params),
    add: (data) => GeneratorCodeService.create(data),
    edit: (data) => GeneratorCodeService.update(data.id, data),
    remove: (id) => GeneratorCodeService.remove(id),
    view: (id) => GeneratorCodeService.get(id),
  },
  hasAdd: false,
  hasEdit: false,
  hasRemove: true,
  hasView: false,
  permissions: {
    add: 'generate:code:create',
    remove: 'generate:code:delete',
    edit: 'generate:code:update',
    view: 'generate:code:read',
  },
  columns: [
    { type: 'checkbox', width: 60 },
    {
      field: 'plugin_name',
      title: $t('app.generator.list.plugin_name'),
      align: 'left',
      minWidth: 80,
      formatter: ({ cellValue }: any) => cellValue || '/',
    },
    {
      field: 'table_name',
      title: $t('app.generator.list.table_name'),
      align: 'left',
      minWidth: 120,
    },
    {
      field: 'table_content',
      title: $t('app.generator.list.table_content'),
      minWidth: 160,
    },
    {
      field: 'created_at',
      title: $t('app.generator.list.created_date'),
      align: 'left',
      width: 140,
      formatter: 'formatDateTime',
      visible: false,
    },
    {
      field: 'updated_at',
      title: $t('app.generator.list.updated_date'),
      align: 'left',
      width: 140,
      formatter: 'formatDateTime',
    },
  ],
  searchForm: {
    enabled: true,
    collapsed: true,
    collapsedRows: 2,
    schema: [
      {
        component: 'Input',
        fieldName: 'LIKE_table_name',
        label: $t('app.generator.list.query.table_name'),
        componentProps: {
          placeholder: $t('app.generator.list.query.placeholder_table_name'),
          clearable: true,
        },
      },
    ],
  },
  formDialog: {
    enabled: false,
    schema: [],
  },
});
