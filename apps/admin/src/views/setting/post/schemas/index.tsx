import type { CrudSchema } from '#/components/crud/components/types'

import { PostService } from '#/api/setting/post'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: PostService.list,
      add: PostService.create,
      edit: PostService.update,
      remove: PostService.delete,
      batchRemove: PostService.remove,
      view: PostService.get,
    },

    table: {
      hasAdd: true,
      hasEdit: true,
      hasView: true,
      hasRemove: true,
      permissions: {
        add: 'org:post:create',
        edit: 'org:post:update',
        remove: 'org:post:delete',
        view: 'org:post:read',
      },
      columns: [
        { type: 'checkbox', width: 60 },
        { field: 'dept.name', title: $t('setting.dept.table.columns.name'), minWidth: 120 },
        { field: 'code', title: $t('setting.post.table.columns.code'), minWidth: 120 },
        { field: 'name', title: $t('setting.post.table.columns.name'), minWidth: 120 },
        { field: 'sort', title: $t('setting.post.table.columns.sort'), minWidth: 80 },
         {
          field: 'enabled',
          title: $t('setting.post.table.columns.enabled'),
          minWidth: 80,
          cellRender: { name: 'CellDictTag', attrs: { code: DictEnum.SYS_ENABLED_STATUS } },
        },
        { field: 'remark', title: $t('setting.post.table.columns.remark'), minWidth: 160 },
      ],
    },

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'ApiTreeSelect',
          fieldName: 'EQ_dept_id',
          label: $t('setting.post.form.dept_name'),
          componentProps: {
            clearable: true,
            checkStrictly: true,
            api: '/org/dept',
            params: { format: 'tree' },
            labelField: 'name',
            valueField: 'id',
            childrenField: 'children',
            placeholder: $t('setting.post.form.placeholder.dept_name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: $t('setting.post.table.search.code'),
          componentProps: {
            clearable: true,
            placeholder: $t('setting.post.table.search.placeholder.code'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('setting.post.table.search.name'),
          componentProps: {
            clearable: true,
            placeholder: $t('setting.post.table.search.placeholder.name'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('setting.post.table.search.enabled'),
          componentProps: {
            clearable: true,
            code: DictEnum.SYS_ENABLED_STATUS,
            placeholder: $t('setting.post.table.search.placeholder.enabled'),
          },
        },
      ],
    },

    formDialog: {
      enabled: true,
      title: $t('setting.post.title'),
      width: 'w-[50%]',
      wrapperClass: 'grid-cols-1',
      commonConfig: {
        labelWidth: 100,
        labelAlign: 'right',
      },
      schema: [
        {
          label: $t('setting.post.form.id'),
          fieldName: 'id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          label: $t('setting.post.form.dept_name'),
          fieldName: 'dept_id',
          component: 'ApiTreeSelect',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            clearable: true,
            checkStrictly: true,
            api: '/org/dept',
            requestMethod: 'get',
            params: { format: 'tree' },
            labelField: 'name',
            valueField: 'id',
            childrenField: 'children',
            placeholder: $t('setting.post.form.placeholder.dept_name'),
          },
        },
        {
          label: $t('setting.post.form.name'),
          fieldName: 'name',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t('setting.post.form.placeholder.name'),
          },
        },
        {
          label: $t('setting.post.form.code'),
          fieldName: 'code',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            placeholder: $t('setting.post.form.placeholder.code'),
          },
        },
        {
          label: $t('setting.post.form.sort'),
          fieldName: 'sort',
          component: 'InputNumber',
          defaultValue: 0,
          formItemClass: 'col-span-2',
          componentProps: { min: 0 },
        },
        {
          label: $t('setting.post.form.enabled'),
          fieldName: 'enabled',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-2',
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
        {
          label: $t('setting.post.form.remark'),
          fieldName: 'remark',
          component: 'Input',
          formItemClass: 'col-span-2',
          componentProps: {
            type: 'textarea',
            placeholder: $t('setting.post.form.placeholder.remark'),
          },
        },
      ],
    },
  }
};
