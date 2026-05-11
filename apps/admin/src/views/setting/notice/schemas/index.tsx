import type { CrudSchema } from '#/adapter/crud'

import { NoticeService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: NoticeService.list,
      add: NoticeService.create,
      edit: NoticeService.update,
      remove: NoticeService.remove,
      view: NoticeService.get,
    },
    dialogTitle: $t('setting.notice.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'setting:notice:create',
    removeAuth: 'setting:notice:delete',
    editAuth: 'setting:notice:update',
    viewAuth: 'setting:notice:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.notice.table.columns.id'), minWidth: 60, visible: false },
      { field: 'title', title: $t('setting.notice.table.columns.title'), minWidth: 150 },
      {
        field: 'type',
        title: $t('setting.notice.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_NOTICE_TYPE },
      },
      {
        field: 'enabled',
        title: $t('setting.notice.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'created_date', title: $t('setting.notice.table.columns.created_date'), minWidth: 160 },
      { field: 'remark', title: $t('setting.notice.table.columns.remark'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_title',
        label: $t('setting.notice.search.title'),
        component: 'Input',
      },
      {
        fieldName: 'EQ_type',
        label: $t('setting.notice.search.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_NOTICE_TYPE, clearable: true },
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('setting.notice.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'title', label: $t('setting.notice.form.title'), component: 'Input', rules: 'required' },
      {
        fieldName: 'type',
        label: $t('setting.notice.form.type'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_NOTICE_TYPE, clearable: true },
      },
      { fieldName: 'content', label: $t('setting.notice.form.content'), component: 'Editor' },
      {
        fieldName: 'enabled',
        label: $t('setting.notice.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      { fieldName: 'remark', label: $t('setting.notice.form.remark'), component: 'Input', componentProps: { type: 'textarea', rows: 3 } },
    ],
    dialogWidth: '60%',
  }
}
