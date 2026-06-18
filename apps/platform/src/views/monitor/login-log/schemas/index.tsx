import type { CrudSchema } from '#/components/crud/components/types';

import { LoginLogService } from '#/api/monitor';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: LoginLogService.list,
      add: LoginLogService.create as any,
      edit: LoginLogService.update as any,
      remove: LoginLogService.delete,
      batchRemove: LoginLogService.remove,
      view: LoginLogService.get,
    },
    hasAdd: false,
    hasEdit: false,
    hasView: true,
    hasRemove: true,
    permissions: {
      remove: 'platform:monitor:login-log:delete',
      view: 'platform:monitor:login-log:view',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'account.user_name',
        title: $t('monitor.login.log.columns.user_name'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'account.real_name',
        title: $t('monitor.login.log.columns.real_name'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'status',
        title: $t('monitor.login.log.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_OPERATION_RESULT },
      },
      {
        field: 'os',
        title: $t('monitor.login.log.columns.os'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'browser',
        title: $t('monitor.login.log.columns.browser'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'ip',
        title: $t('monitor.login.log.columns.ip'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'ip_location',
        title: $t('monitor.login.log.columns.ip_location'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'created_at',
        title: $t('monitor.login.log.columns.login_time'),
        minWidth: 170,
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
          label: $t('monitor.login.log.search.user_name'),
          componentProps: { clearable: true },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_ip',
          label: $t('monitor.login.log.search.ip'),
          componentProps: { clearable: true },
        },
        {
          component: 'ApiDict',
          fieldName: 'status',
          label: $t('monitor.login.log.search.status'),
          componentProps: {
            code: DictEnum.SYS_OPERATION_RESULT,
            clearable: true,
          },
        },
        {
          component: 'DatePicker',
          fieldName: 'BETWEEN_created_at',
          label: $t('monitor.login.log.search.login_date'),
          componentProps: { type: 'daterange' },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: $t('monitor.login.log.detail_title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 100 },
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          dependencies: { show: false },
        },
        {
          fieldName: 'user_name',
          label: $t('monitor.login.log.form.user_name'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'status',
          label: $t('monitor.login.log.form.status'),
          component: 'ApiDict',
          componentProps: { code: DictEnum.SYS_OPERATION_RESULT },
        },
        {
          fieldName: 'os',
          label: $t('monitor.login.log.form.os'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'browser',
          label: $t('monitor.login.log.form.browser'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip',
          label: $t('monitor.login.log.form.ip'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip_location',
          label: $t('monitor.login.log.form.ip_location'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'created_date',
          label: $t('monitor.login.log.form.login_time'),
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'remark',
          label: $t('monitor.login.log.form.remark'),
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 8 },
        },
      ],
    },
  };
};
