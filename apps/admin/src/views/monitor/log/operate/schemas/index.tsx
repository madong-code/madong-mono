import type { CrudSchema } from '#/components/crud/components/types';
import { OperateLogService } from '#/api/monitor';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: OperateLogService.list,
      add: OperateLogService.create as any,
      edit: OperateLogService.update as any,
      remove: OperateLogService.delete,
      batchRemove: OperateLogService.remove,
      view: OperateLogService.get,
    },
    // ========== 扁平化表格配置 ==========
    hasAdd: false,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'logs:operate:create',
      edit: 'logs:operate:update',
      remove: 'logs:operate:delete',
      view: 'logs:operate:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'name', title: $t('monitor.logs.operate.table.columns.name'), width: 90 },
      { field: 'app', title: $t('monitor.logs.operate.table.columns.app'), width: 60 },
      { field: 'ip', title: $t('monitor.logs.operate.table.columns.ip'), width: 110 },
      {
        field: 'ip_location',
        title: $t('monitor.logs.operate.table.columns.ip_location'),
        minWidth: 120,
      },
      { field: 'os', title: $t('monitor.logs.operate.table.columns.os'), minWidth: 100 },
      {
        field: 'browser',
        title: $t('monitor.logs.operate.table.columns.browser'),
        minWidth: 100,
      },
      { field: 'url', title: $t('monitor.logs.operate.table.columns.url'), minWidth: 170 },
      { field: 'param', title: $t('monitor.logs.operate.table.columns.param'), minWidth: 170 },
      {
        field: 'created_date',
        title: $t('monitor.logs.operate.table.columns.created_date'),
        width: 170,
      },
    ],
    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_user_name',
          label: $t('monitor.logs.operate.table.search.user_name'),
          componentProps: { clearable: true },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_ip',
          label: $t('monitor.logs.operate.table.search.ip'),
          componentProps: { clearable: true },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_url',
          label: $t('monitor.logs.operate.table.search.url'),
          componentProps: { clearable: true },
        },
        {
          component: 'DatePicker',
          fieldName: 'BETWEEN_created_at',
          label: $t('monitor.logs.operate.table.search.created_date'),
          componentProps: { type: 'daterange' },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: $t('monitor.logs.operate.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 100 },
      schema: [
        { fieldName: 'id', label: 'ID', component: 'Input', dependencies: { show: false } },
        {
          fieldName: 'app',
          label: $t('monitor.logs.operate.form.app'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip',
          label: $t('monitor.logs.operate.form.ip'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'class_name',
          label: $t('monitor.logs.operate.form.class_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'method',
          label: $t('monitor.logs.operate.form.method'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'action',
          label: $t('monitor.logs.operate.form.action'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'created_date',
          label: $t('monitor.logs.operate.form.created_date'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'user_name',
          label: $t('monitor.logs.operate.form.user_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'param',
          label: $t('monitor.logs.operate.form.param'),
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 5 },
        },
        {
          fieldName: 'result',
          label: $t('monitor.logs.operate.form.result'),
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 8 },
        },
      ],
    },
  };
};
