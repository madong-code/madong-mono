import type { CrudSchema } from '#/components/crud/components/types';

import { DbSettingService } from '#/api/platform/db';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: DbSettingService.list,
      add: DbSettingService.create,
      edit: DbSettingService.update,
      remove: DbSettingService.delete,
      view: DbSettingService.get,
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: true,

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: 'ID', minWidth: 60, visible: false },
      { field: 'name', title: '数据源名称', minWidth: 130 },
      { field: 'host', title: '主机', minWidth: 120 },
      { field: 'port', title: '端口', minWidth: 70 },
      { field: 'database', title: '数据库', minWidth: 120 },
      { field: 'username', title: '用户名', minWidth: 100 },
      { field: 'driver', title: '驱动', minWidth: 80 },
      {
        field: 'enabled',
        title: '状态',
        minWidth: 80,
        componentProps: {
          options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }],
        },
      },
      { field: 'description', title: '备注', minWidth: 150 },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        { component: 'Input', fieldName: 'LIKE_name', label: '数据源名称', componentProps: { placeholder: '请输入名称' } },
        { component: 'Input', fieldName: 'LIKE_database', label: '数据库名', componentProps: { placeholder: '请输入数据库名' } },
        {
          component: 'Select',
          fieldName: 'EQ_driver',
          label: '驱动',
          componentProps: {
            options: [
              { label: 'MySQL', value: 'mysql' },
              { label: 'PostgreSQL', value: 'pgsql' },
              { label: 'SQLite', value: 'sqlite' },
            ],
            clearable: true,
          },
        },
      ],
    },

    formDialog: {
      wrapperClass: 'grid-cols-1',
      dialogType: 'drawer',
      commonConfig: { labelWidth: 80 },
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
        { fieldName: 'name', label: '名称', component: 'Input', rules: 'required', formItemClass: 'col-span-1' },
        { fieldName: 'host', label: '主机', component: 'Input', rules: 'required', formItemClass: 'col-span-1' },
        { fieldName: 'port', label: '端口', component: 'InputNumber', defaultValue: 3306, componentProps: { min: 1, max: 65535 }, formItemClass: 'col-span-1' },
        { fieldName: 'database', label: '数据库名', component: 'Input', rules: 'required', formItemClass: 'col-span-1' },
        { fieldName: 'username', label: '用户名', component: 'Input', rules: 'required', formItemClass: 'col-span-1' },
        { fieldName: 'password', label: '密码', component: 'Password', componentProps: { placeholder: '留空则不修改密码' }, formItemClass: 'col-span-1' },
        {
          fieldName: 'driver',
          label: '驱动',
          component: 'Select',
          rules: 'required',
          defaultValue: 'mysql',
          componentProps: {
            options: [
              { label: 'MySQL', value: 'mysql' },
              { label: 'PostgreSQL', value: 'pgsql' },
              { label: 'SQLite', value: 'sqlite' },
            ],
          },
          formItemClass: 'col-span-1',
        },
        { fieldName: 'prefix', label: '表前缀', component: 'Input', formItemClass: 'col-span-1' },
        { fieldName: 'charset', label: '字符集', component: 'Input', componentProps: { placeholder: 'utf8mb4' }, formItemClass: 'col-span-1' },
        { fieldName: 'description', label: '备注', component: 'Input', formItemClass: 'col-span-1' },
      ],
    },
  };
};
