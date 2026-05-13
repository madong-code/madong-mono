import type { CrudSchema } from '#/components/crud/components/types'

import { PostService } from '#/api/setting'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: PostService.list,
    add: PostService.create,
    edit: PostService.update,
    remove: PostService.remove,
    view: PostService.get,
  },

  // 表格配置
  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'setting:post:create',
      edit: 'setting:post:update',
      remove: 'setting:post:delete',
      view: 'setting:post:read',
    },
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
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_name',
        label: $t('setting.post.search.name'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
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
    title: $t('setting.post.title'),
    width: 'w-[40%]',
  },
}
