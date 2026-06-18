import type { CrudSchema } from '#/components/crud/components/types';

import { DbSettingService } from '#/api/database';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: DbSettingService.list,
      add: DbSettingService.create,
      edit: (data) => DbSettingService.update(data.id, data),
      remove: DbSettingService.delete,
      batchRemove: DbSettingService.remove,
      view: DbSettingService.get,
    },

    hasView: true,
    hasAdd: true,
    hasEdit: true,
    hasRemove: true,

    permissions: {
      add: 'platform:database:setting:create',
      edit: 'platform:database:setting:update',
      remove: 'platform:database:setting:delete',
      view: 'platform:database:setting:view',
    },

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: 'ID', minWidth: 60, visible: false },
      {
        field: 'name',
        title: $t('database.table.columns.name'),
        minWidth: 130,
        align: 'left',
      },
      {
        field: 'host',
        title: $t('database.table.columns.host'),
        minWidth: 120,
        align: 'left',
      },
      { field: 'port', title: $t('database.table.columns.port'), minWidth: 70 },
      {
        field: 'database',
        title: $t('database.table.columns.database'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'username',
        title: $t('database.table.columns.username'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'driver',
        title: $t('database.table.columns.driver'),
        minWidth: 80,
        align: 'left',
      },
      {
        field: 'enabled',
        title: $t('database.table.columns.enabled'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_ENABLED_STATUS },
        },
      },
      {
        field: 'description',
        title: $t('database.table.columns.description'),
        minWidth: 150,
        align: 'left',
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('database.search.name'),
          componentProps: {
            placeholder: $t('database.search.placeholder_name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_database',
          label: $t('database.search.database_name'),
          componentProps: {
            placeholder: $t('database.search.placeholder_database'),
          },
        },
        {
          component: 'Select',
          fieldName: 'EQ_driver',
          label: $t('database.search.driver'),
          componentProps: {
            options: [
              { label: $t('database.drivers.mysql'), value: 'mysql' },
              { label: $t('database.drivers.pgsql'), value: 'pgsql' },
              { label: $t('database.drivers.sqlite'), value: 'sqlite' },
            ],
            clearable: true,
          },
        },
      ],
    },

    formDialog: {
      wrapperClass: 'grid-cols-1',
      dialogType: 'drawer',
      commonConfig: { labelWidth: 120 },
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
          dependencies: {
            triggerFields: ['id'],
            show: false,
          },
        },
        {
          fieldName: 'name',
          label: $t('database.form.name'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'host',
          label: $t('database.form.host'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'port',
          label: $t('database.form.port'),
          component: 'InputNumber',
          defaultValue: 3306,
          componentProps: { min: 1, max: 65_535 },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'database',
          label: $t('database.form.database'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'username',
          label: $t('database.form.username'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'password',
          label: $t('database.form.password'),
          component: 'Password',
          componentProps: {
            placeholder: $t('database.form.password_placeholder'),
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'driver',
          label: $t('database.form.driver'),
          component: 'Select',
          rules: 'required',
          defaultValue: 'mysql',
          componentProps: {
            options: [
              { label: $t('database.drivers.mysql'), value: 'mysql' },
              { label: $t('database.drivers.pgsql'), value: 'pgsql' },
              { label: $t('database.drivers.sqlite'), value: 'sqlite' },
            ],
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'prefix',
          label: $t('database.form.prefix'),
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'charset',
          label: $t('database.form.charset'),
          component: 'Input',
          componentProps: {
            placeholder: $t('database.form.charset_placeholder'),
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'is_existing',
          label: $t('database.form.is_existing'),
          help: $t('database.form.is_existing_help'),
          component: 'ApiDict',
          formItemClass: 'col-span-1',
          defaultValue: 0,
          componentProps: {
            code: DictEnum.SYS_YES_NO,
            renderType: 'RadioGroup',
            isBtn: true,
          },
        },
        {
          fieldName: 'enabled',
          label: $t('database.form.enabled'),
          component: 'ApiDict',
          formItemClass: 'col-span-1',
          defaultValue: 1,
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            renderType: 'RadioGroup',
            isBtn: true,
          },
        },
        {
          fieldName: 'description',
          label: $t('database.form.description'),
          component: 'Textarea',
          formItemClass: 'col-span-1',
          componentProps: { autoSize: true, rows: 4 },
        },
      ],
    },
  };
};
