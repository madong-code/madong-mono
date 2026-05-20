import type { CrudSchema } from '#/components/crud/components/types';
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
    table: {
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
    },
    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_title',
          label: $t('tools.crontab.table.search.title'),
        },
      ],
    },
    formDialog: {
      enabled: true,
      dialogType: 'drawer',
      title: $t('tools.crontab.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: { labelWidth: 120 },
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          fieldName: 'title',
          label: $t('tools.crontab.form.title'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'rule',
          label: $t('tools.crontab.form.rule'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'target',
          label: $t('tools.crontab.form.target'),
          component: 'Input',
          rules: 'required',
        },
        { fieldName: 'parameter', label: $t('tools.crontab.form.parameter'), component: 'Input' },
        {
          fieldName: 'singleton',
          label: $t('tools.crontab.form.singleton'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: {
            code: DictEnum.SYS_MONITOR_CRONTAB_MODE,
            renderType: 'RadioGroup',
            isBtn: true,
          },
        },
        {
          fieldName: 'enabled',
          label: $t('tools.crontab.form.enabled'),
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            renderType: 'RadioGroup',
            isBtn: true,
          },
        },
        {
          fieldName: 'remark',
          label: $t('tools.crontab.form.remark'),
          component: 'Input',
          componentProps: { type: 'textarea', rows: 4 },
        },
      ],
    },
  };
};
