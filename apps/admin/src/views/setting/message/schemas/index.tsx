import type { CrudSchema } from '#/components/crud/components/types'
import { MessageService } from '#/api/setting/message'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: { list: MessageService.list, add: MessageService.create as any, edit: MessageService.update as any, remove: MessageService.remove, batchRemove: MessageService.remove as any, view: MessageService.get },
  table: {
    hasAdd: false, hasEdit: false, hasView: false, hasRemove: false,
    permissions: { add: 'system:message:create', edit: 'system:message:update', remove: 'system:message:delete', view: 'system:message:read' },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'priority', title: $t('setting.message.table.columns.priority'), width: 70, viewComponent: 'ApiDict', viewComponentProps: { code: DictEnum.SYS_MESSAGE_PRIORITY } },
      { field: 'related_id', title: $t('setting.message.table.columns.related_id'), minWidth: 100 },
      { field: 'title', title: $t('setting.message.table.columns.title'), minWidth: 150 },
      { field: 'content', title: $t('setting.message.table.columns.content'), minWidth: 200 },
      { field: 'status', title: $t('setting.message.table.columns.status'), minWidth: 80, viewComponent: 'ApiDict', viewComponentProps: { code: DictEnum.SYS_MESSAGE_STATUS } },
      { field: 'sender.real_name', title: $t('setting.message.table.columns.sender'), minWidth: 100 },
      { field: 'created_date', title: $t('setting.message.table.columns.created_date'), minWidth: 160 },
      { field: 'read_date', title: $t('setting.message.table.columns.read_date'), minWidth: 160 },
    ],
  },
  searchForm: {
    enabled: true, collapsed: true, collapsedRows: 2,
    schema: [
      { component: 'Input', fieldName: 'LIKE_title', label: $t('setting.message.table.search.title') },
      { component: 'Input', fieldName: 'LIKE_content', label: $t('setting.message.table.search.content') },
      { component: 'ApiDict', fieldName: 'EQ_status', label: $t('setting.message.table.search.status'), componentProps: { code: DictEnum.SYS_MESSAGE_STATUS, clearable: true } },
      { component: 'ApiDict', fieldName: 'EQ_priority', label: $t('setting.message.table.search.priority'), componentProps: { code: DictEnum.SYS_MESSAGE_PRIORITY, clearable: true } },
    ],
  },
  formDialog: {
    enabled: true, title: $t('setting.message.title'), width: 'w-[50%]', wrapperClass: 'grid-cols-1', commonConfig: { labelWidth: 100 },
    schema: [
      { fieldName: 'id', label: 'ID', component: 'Input', dependencies: { show: false } },
      { fieldName: 'title', label: $t('setting.message.form.title'), component: 'Input', rules: 'required' },
      { fieldName: 'content', label: $t('setting.message.form.content'), component: 'Input', componentProps: { type: 'textarea', rows: 6 } },
      { fieldName: 'status', label: $t('setting.message.form.status'), component: 'ApiDict', defaultValue: 0, componentProps: { code: DictEnum.SYS_MESSAGE_STATUS, renderType: 'RadioGroup', isBtn: true } },
      { fieldName: 'priority', label: $t('setting.message.form.priority'), component: 'ApiDict', defaultValue: 1, componentProps: { code: DictEnum.SYS_MESSAGE_PRIORITY, renderType: 'RadioGroup', isBtn: true } },
      { fieldName: 'type', label: $t('setting.message.form.type'), component: 'ApiDict', defaultValue: 1, componentProps: { code: DictEnum.SYS_MESSAGE_TYPE, renderType: 'RadioGroup', isBtn: true } },
      { fieldName: 'remark', label: $t('setting.message.form.remark'), component: 'Input', componentProps: { type: 'textarea', rows: 3 } },
    ],
  },
}
