import type { CrudSchema } from '#/adapter/crud'

import { MessageService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MessageService.list,
      add: MessageService.create,
      edit: MessageService.update,
      remove: MessageService.remove,
      view: MessageService.get,
    },
    dialogTitle: $t('setting.message.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'setting:message:create',
    removeAuth: 'setting:message:delete',
    editAuth: 'setting:message:update',
    viewAuth: 'setting:message:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.message.table.columns.id'), minWidth: 60, visible: false },
      { field: 'title', title: $t('setting.message.table.columns.title'), minWidth: 150 },
      {
        field: 'type',
        title: $t('setting.message.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MESSAGE_TYPE },
      },
      {
        field: 'status',
        title: $t('setting.message.table.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MESSAGE_STATUS },
      },
      {
        field: 'priority',
        title: $t('setting.message.table.columns.priority'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MESSAGE_PRIORITY },
      },
      { field: 'created_date', title: $t('setting.message.table.columns.created_date'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_title',
        label: $t('setting.message.search.title'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_type',
        label: $t('setting.message.search.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_MESSAGE_TYPE, clearable: true },
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('setting.message.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'title', label: $t('setting.message.form.title'), component: 'Input', rules: 'required' },
      {
        fieldName: 'type',
        label: $t('setting.message.form.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_MESSAGE_TYPE, clearable: true },
      },
      { fieldName: 'content', label: $t('setting.message.form.content'), component: 'Editor' },
      {
        fieldName: 'enabled',
        label: $t('setting.message.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    dialogWidth: '60%',
  }
}
