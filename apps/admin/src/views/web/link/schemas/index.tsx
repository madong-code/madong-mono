import type { CrudSchema } from '#/adapter/crud'

import { LinkService } from '#/api/web'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: LinkService.list,
      add: LinkService.create,
      edit: LinkService.update,
      remove: LinkService.remove,
      view: LinkService.get,
    },
    dialogTitle: $t('web.link.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'web:link:create',
    removeAuth: 'web:link:delete',
    editAuth: 'web:link:update',
    viewAuth: 'web:link:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('web.link.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('web.link.table.columns.name'), minWidth: 120 },
      { field: 'url', title: $t('web.link.table.columns.url'), minWidth: 200 },
      { field: 'logo', title: $t('web.link.table.columns.logo'), minWidth: 80, viewComponent: 'CellImage' },
      { field: 'sort', title: $t('web.link.table.columns.sort'), minWidth: 80 },
      {
        field: 'status',
        title: $t('web.link.table.columns.status'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_name',
        label: $t('web.link.search.name'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('web.link.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'name', label: $t('web.link.form.name'), component: 'Input', rules: 'required' },
      { fieldName: 'url', label: $t('web.link.form.url'), component: 'Input', rules: 'required' },
      { fieldName: 'logo', label: $t('web.link.form.logo'), component: 'Upload' },
      { fieldName: 'sort', label: $t('web.link.form.sort'), component: 'InputNumber', defaultValue: 0, componentProps: { min: 0, precision: 0 } },
      {
        fieldName: 'status',
        label: $t('web.link.form.status'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
    ],
    dialogWidth: '40%',
  }
}
