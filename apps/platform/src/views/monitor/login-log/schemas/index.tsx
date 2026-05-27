import type { CrudSchema } from '#/components/crud/components/types';
import { LoginLogService } from '#/api/monitor';
import { DictEnum } from '#/enums';

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
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'account.user_name',
        title: '用户名',
        minWidth: 100,
      },
      {
        field: 'account.real_name',
        title: '姓名',
        minWidth: 100,
      },
      {
        field: 'status',
        title: '状态',
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_OPERATION_RESULT },
      },
      { field: 'os', title: '操作系统', minWidth: 100 },
      { field: 'browser', title: '浏览器', minWidth: 100 },
      { field: 'ip', title: 'IP地址', minWidth: 120 },
      {
        field: 'ip_location',
        title: '登录地点',
        minWidth: 120,
      },
      {
        field: 'created_at',
        title: '登录时间',
        minWidth: 170,
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
          label: '用户名',
          componentProps: { clearable: true },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_ip',
          label: 'IP地址',
          componentProps: { clearable: true },
        },
        {
          component: 'ApiDict',
          fieldName: 'status',
          label: '状态',
          componentProps: { code: DictEnum.SYS_OPERATION_RESULT, clearable: true },
        },
        {
          component: 'DatePicker',
          fieldName: 'BETWEEN_created_at',
          label: '登录日期',
          componentProps: { type: 'daterange' },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: '登录日志详情',
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 100 },
      schema: [
        { fieldName: 'id', label: 'ID', component: 'Input', dependencies: { show: false } },
        {
          fieldName: 'user_name',
          label: '用户名',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'status',
          label: '状态',
          component: 'ApiDict',
          componentProps: { code: DictEnum.SYS_OPERATION_RESULT },
        },
        {
          fieldName: 'os',
          label: '操作系统',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'browser',
          label: '浏览器',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip',
          label: 'IP地址',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'ip_location',
          label: '登录地点',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'created_date',
          label: '登录时间',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'remark',
          label: '备注',
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 8 },
        },
      ],
    },
  }
}
