import type { CrudSchema } from '#/adapter/crud'

import { CrontabService } from '#/api/tools'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'
import { ElMessage } from 'element-plus'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: CrontabService.list,
      add: CrontabService.create,
      edit: CrontabService.update,
      remove: CrontabService.remove,
      view: CrontabService.get,
    },
    dialogTitle: $t('tools.crontab.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'tools:crontab:create',
    removeAuth: 'tools:crontab:delete',
    editAuth: 'tools:crontab:update',
    viewAuth: 'tools:crontab:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('tools.crontab.table.columns.id'), minWidth: 60, visible: false },
      { field: 'title', title: $t('tools.crontab.table.columns.title'), minWidth: 120 },
      { field: 'biz_id', title: $t('tools.crontab.table.columns.biz_id'), minWidth: 100 },
      {
        field: 'type',
        title: $t('tools.crontab.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MONITOR_CRONTAB_TYPE },
      },
      {
        field: 'task_cycle',
        title: $t('tools.crontab.table.columns.task_cycle'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MONITOR_CRONTAB_CYCLE },
      },
      { field: 'rule', title: $t('tools.crontab.table.columns.rule'), minWidth: 120 },
      { field: 'target', title: $t('tools.crontab.table.columns.target'), minWidth: 120 },
      { field: 'running_times', title: $t('tools.crontab.table.columns.running_times'), minWidth: 80 },
      {
        field: 'enabled',
        title: $t('tools.crontab.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_title',
        label: $t('tools.crontab.search.title'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('tools.crontab.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'title', label: $t('tools.crontab.form.title'), component: 'Input', rules: 'required' },
      { fieldName: 'biz_id', label: $t('tools.crontab.form.biz_id'), component: 'Input' },
      {
        fieldName: 'type',
        label: $t('tools.crontab.form.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_MONITOR_CRONTAB_TYPE, clearable: true },
      },
      {
        fieldName: 'task_cycle',
        label: $t('tools.crontab.form.task_cycle'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_MONITOR_CRONTAB_CYCLE, clearable: true },
      },
      { fieldName: 'rule', label: $t('tools.crontab.form.rule'), component: 'Input' },
      { fieldName: 'target', label: $t('tools.crontab.form.target'), component: 'Input' },
      {
        fieldName: 'enabled',
        label: $t('tools.crontab.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    dropDownActions: [
      {
        label: $t('tools.crontab.table.actions.execute'),
        auth: 'tools:crontab:update',
        ifShow: ({ row }: any) => row.enabled === 1,
        onClick: async ({ row }: any) => {
          await CrontabService.execute(row.id)
          ElMessage.success($t('common.operationSuccess'))
        },
      },
      {
        label: $t('tools.crontab.table.actions.start'),
        auth: 'tools:crontab:update',
        ifShow: ({ row }: any) => row.enabled === 0,
        onClick: async ({ row, crudApi }: any) => {
          await CrontabService.start(row.id)
          ElMessage.success($t('common.operationSuccess'))
          crudApi.refreshSoft()
        },
      },
      {
        label: $t('tools.crontab.table.actions.stop'),
        auth: 'tools:crontab:update',
        ifShow: ({ row }: any) => row.enabled === 1,
        onClick: async ({ row, crudApi }: any) => {
          await CrontabService.pause(row.id)
          ElMessage.success($t('common.operationSuccess'))
          crudApi.refreshSoft()
        },
      },
      {
        label: $t('tools.crontab.table.actions.logs'),
        auth: 'tools:crontab:read',
        onClick: ({ row }: any) => {
          crontabLogDrawerOpener.open(row)
        },
      },
    ],
    dialogWidth: '40%',
  }
}

export const crontabLogDrawerOpener = { open: (_row: any) => {} }
