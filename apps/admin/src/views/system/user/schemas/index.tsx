import type { CrudSchema } from '#/components/crud/components/types'

import { UserService } from '#/api/system/user'
import { PostService } from '#/api/setting/post'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const crudSchema: CrudSchema = {
  crudApi: {
    list: UserService.list,
    add: UserService.create,
    edit: UserService.update,
    remove: UserService.delete,
    batchRemove: UserService.remove,
    view: UserService.get,
  },

  table: {
    hasAdd: true,
    hasEdit: true,
    hasView: true,
    hasRemove: true,
    permissions: {
      add: 'system:user:create',
      edit: 'system:user:update',
      remove: 'system:user:delete',
      view: 'system:user:read',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'user_name', title: $t('system.user.table.columns.user_name'), minWidth: 80 },
      { field: 'real_name', title: $t('system.user.table.columns.real_name'), minWidth: 130 },
      { field: 'dept_name', title: $t('system.user.table.columns.dept_name'), minWidth: 100 },
      { field: 'mobile_phone', title: $t('system.user.table.columns.mobile_phone'), minWidth: 120 },
      {
        field: 'enabled',
        title: $t('system.user.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
      {
        field: 'is_locked',
        title: $t('system.user.table.columns.is_locked'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_LOCKED_STATUS },
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
        fieldName: 'LIKE_user_name',
        label: $t('system.user.table.search.user_name'),
        componentProps: {
          clearable: true,
          placeholder: $t('system.user.table.search.placeholder.user_name'),
        },
      },
      {
        component: 'Input',
        fieldName: 'LIKE_real_name',
        label: $t('system.user.table.search.real_name'),
        componentProps: {
          clearable: true,
          placeholder: $t('system.user.table.search.placeholder.real_name'),
        },
      },
      {
        component: 'Input',
        fieldName: 'LIKE_mobile_phone',
        label: $t('system.user.table.search.mobile_phone'),
        componentProps: {
          clearable: true,
          placeholder: $t('system.user.table.search.placeholder.mobile_phone'),
        },
      },
      {
        component: 'ApiDict',
        fieldName: 'EQ_is_locked',
        label: $t('system.user.table.search.is_locked'),
        componentProps: {
          clearable: true,
          code: 'yes_no',
          placeholder: $t('system.user.table.search.placeholder.is_locked'),
        },
      },
    ],
  },

  formDialog: {
    enabled: true,
    title: $t('system.user.title'),
    width: 'w-[50%]',
    dialogType: 'drawer',
    wrapperClass: 'grid-cols-2',
    commonConfig: {
      labelWidth: 100,
      labelAlign: 'right',
    },
    schema: [
      {
        label: $t('system.user.form.modal.id'),
        fieldName: 'id',
        component: 'Input',
        formItemClass: 'col-span-1',
        dependencies: { triggerFields: ['id'], show: false },
      },
      {
        label: $t('system.user.form.modal.user_name'),
        fieldName: 'user_name',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-1',
        componentProps: {
          placeholder: $t('system.user.form.placeholder.user_name'),
        },
      },
      {
        label: $t('system.user.form.modal.password'),
        fieldName: 'password',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-1',
        dependencies: {
          triggerFields: ['id'],
          if(values) {
            return values.id === undefined
          },
        },
        componentProps: {
          type: 'password',
          showPassword: true,
          placeholder: $t('system.user.form.placeholder.password'),
        },
      },
      {
        label: $t('system.user.form.modal.real_name'),
        fieldName: 'real_name',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-1',
        componentProps: {
          placeholder: $t('system.user.form.placeholder.real_name'),
        },
      },
      {
        label: $t('system.user.form.modal.mobile_phone'),
        fieldName: 'mobile_phone',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-1',
        componentProps: {
          placeholder: $t('system.user.form.placeholder.mobile_phone'),
        },
      },
      {
        label: $t('system.user.form.modal.email'),
        fieldName: 'email',
        component: 'Input',
        rules: 'required',
        formItemClass: 'col-span-1',
        componentProps: {
          placeholder: $t('system.user.form.placeholder.email'),
        },
      },
      {
        label: $t('system.user.form.modal.sex'),
        fieldName: 'sex',
        component: 'ApiDict',
        defaultValue: 0,
        formItemClass: 'col-span-1',
        componentProps: {
          code: DictEnum.SYS_SEX,
          renderType: 'RadioGroup',
          isBtn: true,
        },
      },
      {
        label: $t('system.user.form.modal.dept_name'),
        fieldName: 'dept_id',
        component: 'ApiTreeSelect',
        formItemClass: 'col-span-1',
        componentProps: (_values: any) => ({
          checkStrictly: true,
          placeholder: $t('system.user.form.placeholder.dept_name'),
          clearable: true,
          api: '/org/dept',
          params: { format: 'tree' },
          labelField: 'name',
          valueField: 'id',
          onChange: () => {
            _values.post_id_list = []
          },
        }),
      },
      {
        label: $t('system.user.form.modal.post_name'),
        fieldName: 'post_id_list',
        component: 'ApiSelect',
        defaultValue: [],
        formItemClass: 'col-span-1',
        componentProps: (_value: any) => ({
          multiple: true,
          disabled: !_value?.dept_id,
          placeholder: $t('system.user.form.placeholder.post_name'),
          clearable: true,
          api: '/org/post',
          requestMethod: 'get',
          params: {
            format: 'select',
            dept_id: _value?.dept_id || undefined,
          },
        }),
      },
      {
        label: $t('system.user.form.modal.remark'),
        fieldName: 'remark',
        component: 'Input',
        formItemClass: 'col-span-2',
        componentProps: {
          type: 'textarea',
          rows: 4,
          placeholder: $t('system.user.form.placeholder.remark'),
        },
      },
    ],
  },
}
