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
    hasAdd: false,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      remove: 'platform:monitor:operation-log:delete',
      view: 'platform:monitor:operation-log:view',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'name',
        title: $t('ops.log.operate.columns.name'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'app',
        title: $t('ops.log.operate.columns.app'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'ip',
        title: $t('ops.log.operate.columns.ip'),
        width: 110,
        align: 'left',
      },
      {
        field: 'ip_location',
        title: $t('ops.log.operate.columns.ip_location'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'os',
        title: $t('ops.log.operate.columns.os'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'browser',
        title: $t('ops.log.operate.columns.browser'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'url',
        title: $t('ops.log.operate.columns.url'),
        minWidth: 170,
        align: 'left',
      },
      {
        field: 'param',
        title: $t('ops.log.operate.columns.param'),
        minWidth: 170,
        align: 'left',
      },
      {
        field: 'created_at',
        title: $t('ops.log.operate.columns.created_date'),
        width: 170,
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
          fieldName: 'LIKE_user_name',
          label: $t('ops.log.operate.search.user_name'),
          componentProps: { clearable: true },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_ip',
          label: $t('ops.log.operate.search.ip'),
          componentProps: { clearable: true },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_url',
          label: $t('ops.log.operate.search.url'),
          componentProps: { clearable: true },
        },
        {
          component: 'DatePicker',
          fieldName: 'BETWEEN_created_at',
          label: $t('ops.log.operate.search.date'),
          componentProps: { type: 'daterange' },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: $t('ops.log.operate.detail_title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 100 },
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          dependencies: { show: false, triggerFields: [] },
        },
        {
          fieldName: 'app',
          label: $t('ops.log.operate.form.app'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip',
          label: $t('ops.log.operate.form.ip'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'class_name',
          label: $t('ops.log.operate.form.class_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'method',
          label: $t('ops.log.operate.form.method'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'action',
          label: $t('ops.log.operate.form.action'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'created_date',
          label: $t('ops.log.operate.form.created_date'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'user_name',
          label: $t('ops.log.operate.form.user_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'param',
          label: $t('ops.log.operate.form.param'),
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 5 },
        },
        {
          fieldName: 'result',
          label: $t('ops.log.operate.form.result'),
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 8 },
        },
      ],
    },
  };
};
