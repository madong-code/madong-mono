import type { CrudSchema } from '#/components/crud/components/types'
import { CrontabLogService } from '#/api/tools'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: { list: CrontabLogService.list, add: CrontabLogService.create, edit: CrontabLogService.update, remove: CrontabLogService.delete, batchRemove: CrontabLogService.remove, view: CrontabLogService.get },
  table: {
    hasAdd: false, hasEdit: false, hasView: false, hasRemove: true,
    permissions: { add: 'crontab:log:create', edit: 'crontab:log:update', remove: 'crontab:log:delete', view: 'crontab:log:read' },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'target', title: $t('tools.crontab.log.table.columns.target'), width: 170 },
      { field: 'running_time', title: $t('tools.crontab.log.table.columns.running_time'), minWidth: 100 },
      { field: 'return_code', title: $t('tools.crontab.log.table.columns.return_code'), minWidth: 100, viewComponent: 'ApiDict', viewComponentProps: { code: DictEnum.SYS_OPERATION_RESULT } },
      { field: 'log', title: $t('tools.crontab.log.table.columns.log'), minWidth: 200 },
      { field: 'created_date', title: $t('tools.crontab.log.table.columns.created_date'), minWidth: 140 },
    ],
  },
  searchForm: { enabled: true, collapsed: true, collapsedRows: 2, schema: [
    { component: 'Input', fieldName: 'LIKE_target', label: $t('tools.crontab.log.table.search.target') },
    { component: 'ApiDict', fieldName: 'return_code', label: $t('tools.crontab.log.table.search.return_code'), componentProps: { code: DictEnum.SYS_OPERATION_RESULT, clearable: true } },
  ] },
  formDialog: { enabled: false, schema: [] },
}
