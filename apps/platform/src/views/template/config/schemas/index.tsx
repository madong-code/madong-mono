import type { CrudSchema } from '#/components/crud/components/types';

import { ConfigTemplateService } from '#/api/template/config';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: ConfigTemplateService.list,
      remove: ConfigTemplateService.delete,
      batchRemove: ConfigTemplateService.batchRemove,
    },

    hasAdd: true,
    hasEdit: false,
    hasRemove: false,
    hasBatchRemove: true,
    hasView: false,
    permissions: {
      add: 'config-template:create',
      edit: 'config-template:update',
      remove: 'config-template:delete',
    },

    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'group_code',
        title: $t('template.config.table.columns.group_code'),
        minWidth: 120,
        align: 'left',
        cellRender: {
          name: 'CellDict',
          attrs: { code: DictEnum.SYS_CONFIG_GROUP_CODE },
        },
      },
      {
        field: 'name',
        title: $t('template.config.table.columns.name'),
        minWidth: 180,
        align: 'left',
      },
      {
        field: 'code',
        title: $t('template.config.table.columns.code'),
        minWidth: 200,
        align: 'left',
      },
      {
        field: 'content',
        title: $t('template.config.table.columns.content'),
        minWidth: 200,
        align: 'left',
        formatter: (row: any) => {
          const val = row.content;
          if (val && typeof val === 'string' && val.length > 60) {
            return `${val.slice(0, 60)}...`;
          }
          return val ?? '-';
        },
      },
      {
        field: 'sort',
        title: $t('template.config.table.columns.sort'),
        minWidth: 70,
        align: 'left',
      },
      {
        field: 'enabled',
        title: $t('template.config.table.columns.enabled'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_ENABLED_STATUS },
        },
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'ApiDict',
          fieldName: 'EQ_group_code',
          label: $t('template.config.table.search.group_code'),
          componentProps: {
            code: DictEnum.SYS_CONFIG_GROUP_CODE,
            clearable: true,
            placeholder: $t(
              'template.config.table.search.placeholder.group_code',
            ),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('template.config.table.search.name'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.config.table.search.placeholder.name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: $t('template.config.table.search.code'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.config.table.search.placeholder.code'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('template.config.table.search.enabled'),
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            clearable: true,
            placeholder: $t('template.config.table.search.placeholder.enabled'),
          },
        },
      ],
    },
  };
};
