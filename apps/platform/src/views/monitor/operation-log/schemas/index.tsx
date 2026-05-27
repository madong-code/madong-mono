import type { CrudSchema } from '#/components/crud/components/types';
import { OperateLogService } from '#/api/monitor';

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
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'name', title: '操作名称', width: 90 },
      { field: 'app', title: '应用', width: 60 },
      { field: 'ip', title: 'IP地址', width: 110 },
      {
        field: 'ip_location',
        title: '操作地点',
        minWidth: 120,
      },
      { field: 'os', title: '操作系统', minWidth: 100 },
      {
        field: 'browser',
        title: '浏览器',
        minWidth: 100,
      },
      { field: 'url', title: '请求地址', minWidth: 170 },
      { field: 'param', title: '请求参数', minWidth: 170 },
      {
        field: 'created_date',
        title: '操作时间',
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
          component: 'Input',
          fieldName: 'LIKE_url',
          label: '请求地址',
          componentProps: { clearable: true },
        },
        {
          component: 'DatePicker',
          fieldName: 'BETWEEN_created_at',
          label: '操作日期',
          componentProps: { type: 'daterange' },
        },
      ],
    },
    formDialog: {
      enabled: true,
      title: '操作日志详情',
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 100 },
      schema: [
        { fieldName: 'id', label: 'ID', component: 'Input', dependencies: { show: false } },
        {
          fieldName: 'app',
          label: '应用',
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
          fieldName: 'class_name',
          label: '类名',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'method',
          label: '方法',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'action',
          label: '动作',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'created_date',
          label: '操作时间',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'user_name',
          label: '用户名',
          component: 'Input',
          componentProps: { readOnly: true },
        },
        {
          fieldName: 'param',
          label: '请求参数',
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 5 },
        },
        {
          fieldName: 'result',
          label: '执行结果',
          component: 'Input',
          componentProps: { type: 'textarea', readOnly: true, rows: 8 },
        },
      ],
    },
  };
};
