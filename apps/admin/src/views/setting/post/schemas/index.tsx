import type { CrudSchema } from '#/adapter/crud'

import { PostService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: PostService.list,
      add: PostService.create,
      edit: PostService.update,
      remove: PostService.remove,
      view: PostService.get,
    },
    dialogTitle: $t('setting.post.title'),
    useCrud: true,
    hasAdd: true,
    hasRemove: true,
    hasEdit: true,
    hasView: true,
    addAuth: 'setting:post:create',
    removeAuth: 'setting:post:delete',
    editAuth: 'setting:post:update',
    viewAuth: 'setting:post:read',
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: $t('setting.post.table.columns.id'), minWidth: 60, visible: false },
      { field: 'name', title: $t('setting.post.table.columns.name'), minWidth: 120 },
      { field: 'code', title: $t('setting.post.table.columns.code'), minWidth: 100 },
      { field: 'sort', title: $t('setting.post.table.columns.sort'), minWidth: 80 },
      {
        field: 'enabled',
        title: $t('setting.post.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      { field: 'remark', title: $t('setting.post.table.columns.remark'), minWidth: 160 },
    ],
    searchFormSchema: [
      {
        fieldName: 'LIKE_name',
        label: $t('setting.post.search.name'),
        component: 'Input',
      },
    ],
    formSchema: [
      { fieldName: 'id', label: $t('setting.post.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'name', label: $t('setting.post.form.name'), component: 'Input', rules: 'required' },
      { fieldName: 'code', label: $t('setting.post.form.code'), component: 'Input' },
      { fieldName: 'sort', label: $t('setting.post.form.sort'), component: 'InputNumber', defaultValue: 0, componentProps: { min: 0, precision: 0 } },
      {
        fieldName: 'enabled',
        label: $t('setting.post.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      { fieldName: 'remark', label: $t('setting.post.form.remark'), component: 'Input', componentProps: { type: 'textarea', rows: 3 } },
    ],
    dialogWidth: '40%',
  }
}
