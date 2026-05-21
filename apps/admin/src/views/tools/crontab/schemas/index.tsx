import type { CrudApiInstance, CrudSchema } from '#/components/crud/components/types';
import { CrontabService } from '#/api/tools';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: CrontabService.list,
      add: CrontabService.create,
      edit: CrontabService.update,
      remove: CrontabService.delete,
      batchRemove: CrontabService.remove,
      view: CrontabService.get,
    },
    // ========== 扁平化表格配置 ==========
    rowKey: 'id',
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'crontab:task:create',
      edit: 'crontab:task:update',
      remove: 'crontab:task:delete',
      view: 'crontab:task:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'title',
        title: $t('tools.crontab.table.columns.title'),
        minWidth: 150,
        align: 'left',
      },
      { field: 'rule', title: $t('tools.crontab.table.columns.rule'), minWidth: 100 },
      {
        field: 'singleton',
        title: $t('tools.crontab.table.columns.singleton'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MONITOR_CRONTAB_MODE },
      },
      { field: 'rule_name', title: $t('tools.crontab.table.columns.rule_name'), minWidth: 120 },
      { field: 'target', title: $t('tools.crontab.table.columns.target'), minWidth: 150 },
      { field: 'parameter', title: $t('tools.crontab.table.columns.parameter'), minWidth: 120 },
      {
        field: 'enabled',
        title: $t('tools.crontab.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      {
        field: 'running_status',
        title: $t('tools.crontab.table.columns.running_status'),
        minWidth: 100,
      },
    ],
    tableActions: [],
    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_title',
          label: $t('tools.crontab.table.search.title'),
          componentProps: {
            placeholder: $t('tools.crontab.table.search.placeholder.title'),
            clearable: true,
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_type',
          label: $t('tools.crontab.table.search.type'),
          componentProps: {
            placeholder: $t('tools.crontab.table.search.placeholder.type'),
            clearable: true,
            code: DictEnum.SYS_MONITOR_CRONTAB_TYPE,
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('tools.crontab.table.search.enabled'),
          componentProps: {
            placeholder: $t('tools.crontab.table.search.placeholder.enabled'),
            code: DictEnum.SYS_ENABLED_STATUS,
            clearable: true,
          },
        },
      ],
    },
    formDialog: {
      enabled: true,
      dialogType: 'drawer',
      title: $t('tools.crontab.title'),
      width: 'w-[60%]',
      wrapperClass: 'grid-cols-24',
      commonConfig: { labelWidth: 120 },
      schema: [
        {
          fieldName: 'id',
          label: $t('tools.crontab.form.id'),
          component: 'Input',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          fieldName: 'title',
          label: $t('tools.crontab.form.title'),
          component: 'Input',
          componentProps: {
            placeholder: $t('tools.crontab.form.placeholder.title'),
            clearable: true,
          },
          rules: 'required',
          formItemClass: 'col-span-24 w-full',
        },
        {
          fieldName: 'type',
          label: $t('tools.crontab.form.type'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: {
            placeholder: $t('tools.crontab.form.type'),
            code: DictEnum.SYS_MONITOR_CRONTAB_TYPE,
          },
          formItemClass: 'col-span-24 w-full',
          rules: 'required',
        },
        {
          fieldName: 'rule',
          label: $t('tools.crontab.form.rule'),
          component: 'Input',
          componentProps: {
            placeholder: $t('tools.crontab.form.placeholder.rule'),
            clearable: true,
          },
          dependencies: { 
            triggerFields: ['id'], 
            show: false,
            disabled: (values: any) => {
              return values.id !== undefined && values.id !== '' && values.id !== null;
            },
          },
        },
        {
          fieldName: 'task_cycle',
          label: $t('tools.crontab.form.task_cycle'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: {
            placeholder: $t('tools.crontab.form.placeholder.task_cycle'),
            code: DictEnum.SYS_MONITOR_CRONTAB_CYCLE,
          },
          rules: 'required',
          formItemClass: 'col-span-8',
        },
        {
          fieldName: 'month',
          hideLabel: true,
          component: 'Input',
          dependencies: {
              triggerFields: ['task_cycle'],
              show: (_values: any) => [5].includes(_values.task_cycle),
          },
          componentProps: {
            type: 'number',
            min: 1,
            max: 12,
            suffixIcon: (values: any) => {
              return $t('tools.crontab.form.suffix.month');
            },
          },
          formItemClass: 'col-span-4',
        },
        {
          fieldName: 'day',
          hideLabel: true,
          component: 'Input',
          dependencies: {
            //年份月份的时候显示
            triggerFields: ['task_cycle'],
            show: (_values: any) => [4, 5].includes(_values.task_cycle),
          },
          componentProps: {
            type: 'number',
            min: 1,
            max: 31,
            suffixIcon: (values: any) => {
              return $t('tools.crontab.form.suffix.day'); //日
            },
          },
          formItemClass: 'col-span-4',
        },
        {
          fieldName: 'week',
          hideLabel: true,
          component: 'ApiDict',
          dependencies: {
            //每星期的时候显示周选项
            triggerFields: ['task_cycle'],
            show: (_values: any) => [3].includes(_values.task_cycle),
          },
          componentProps: {
            clearable: true,
            code: DictEnum.SYS_MONITOR_CRONTAB_WEEK,
            placeholder: '',
            suffixIcon: (values: any) => {
              return $t('tools.crontab.form.suffix.day'); //日
            },
          },
          formItemClass: 'col-span-4',
        },
        {
          fieldName: 'hour',
          hideLabel: true,
          component: 'Input',
          dependencies: {
            //每星期的时候显示周选项
            triggerFields: ['task_cycle'],
            show: (_values: any) => [1, 3, 4, 6, 5].includes(_values.task_cycle),
          },
          componentProps: {
            type: 'number',
            suffixIcon: () => $t('tools.crontab.form.suffix.hour'), //时
            min: 1,
            max: 23,
          },
          formItemClass: 'col-span-4',
        },
        {
          fieldName: 'minute',
          hideLabel: true,
          component: 'Input',
          dependencies:{
              triggerFields: ['task_cycle'],
              show: (_values: any) => [1, 2, 3, 4, 6, 7, 5].includes(_values.task_cycle),

          },
          componentProps: {
            type: 'number',
            min: 0,
            max: 59,
            suffixIcon: () => $t('tools.crontab.form.suffix.minute'), //分
          },
          formItemClass: 'col-span-4',
        },
        {
          fieldName: 'second',
          hideLabel: true,
          component: 'Input',
          dependencies:  {
              triggerFields: ['task_cycle'],
              show: (_values: any) => [8].includes(_values.task_cycle),
          },
          componentProps: {
            type: 'number',
            min: 0,
            max: 59,
            suffixIcon: () => $t('tools.crontab.form.suffix.second'), //秒
          },
          formItemClass: 'col-span-4',
        },
        {
          fieldName: 'target',
          label: $t('tools.crontab.form.target'),
          component: 'Input',
          componentProps: {
            type: 'textarea',
            placeholder: $t('tools.crontab.form.placeholder.target'),
            rows: 4,
            clearable: true,
          },
          rules: 'required',
          formItemClass: 'col-span-24 w-full',
        },
        {
          fieldName: 'singleton',
          label: $t('tools.crontab.form.singleton'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: {
            renderType: 'RadioGroup',
            code: DictEnum.SYS_MONITOR_CRONTAB_MODE,
            isBtn: true,
          },
          formItemClass: 'col-span-24 w-full',
          rules: 'required',
        },
        {
          fieldName: 'enabled',
          label: $t('tools.crontab.form.enabled'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: {
            renderType: 'RadioGroup',
            code: DictEnum.SYS_ENABLED_STATUS,
            isBtn: true,
          },
          formItemClass: 'col-span-24 w-full',
          rules: 'required',
        },
        {
          fieldName: 'remark',
          label: $t('tools.crontab.form.remark'),
          component: 'Textarea',
          componentProps: {
            placeholder: $t('tools.crontab.form.placeholder.remark'),
            rows: 5,
          },
          formItemClass: 'col-span-24 w-full',
          dependencies: {
            triggerFields: ['task_cycle'],
            show: false,
          },
        },
      ],
    },
  };
};
