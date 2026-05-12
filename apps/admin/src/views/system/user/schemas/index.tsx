import type { CrudSchema } from '#/adapter/crud'
import type { VbenFormSchema } from '#/adapter/form'

import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const dialogTitle = $t('system.user.title')

/**
 * 定义搜索表单
 * @returns
 */
export function querySchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'LIKE_user_name',
      label: $t('system.user.search.user_name'),
      componentProps: {
        placeholder: $t('system.user.search.placeholder.user_name'),
      },
    },
    {
      component: 'Input',
      fieldName: 'LIKE_real_name',
      label: $t('system.user.search.real_name'),
      componentProps: {
        placeholder: $t('system.user.search.placeholder.real_name'),
      },
    },
    {
      component: 'Input',
      fieldName: 'mobile_phone',
      label: $t('system.user.search.mobile_phone'),
      componentProps: {
        placeholder: $t('system.user.search.placeholder.mobile_phone'),
      },
    },
    {
      component: 'Select',
      fieldName: 'enabled',
      label: $t('system.user.search.enabled'),
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        placeholder: $t('system.user.search.placeholder.enabled'),
      },
    },
  ]
}

/**
 * 定义表格字段数据
 * @returns
 */
export function useColumns(): CrudSchema['columns'] {
  return [
    { type: 'checkbox', width: 60 },
    {
      field: 'user_name',
      title: $t('system.user.table.columns.user_name'),
      minWidth: 100,
    },
    {
      field: 'real_name',
      title: $t('system.user.table.columns.real_name'),
      minWidth: 130,
    },
    {
      field: 'nick_name',
      title: $t('system.user.table.columns.nick_name'),
      minWidth: 100,
    },
    {
      field: 'mobile_phone',
      title: $t('system.user.table.columns.mobile_phone'),
      minWidth: 120,
    },
    {
      field: 'email',
      title: $t('system.user.table.columns.email'),
      minWidth: 160,
    },
    {
      field: 'enabled',
      title: $t('system.user.table.columns.enabled'),
      minWidth: 80,
      viewComponent: 'ApiDict',
      viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
    },
    {
      field: 'login_time',
      title: $t('system.user.table.columns.login_time'),
      minWidth: 160,
    },
    {
      width: 200,
      title: $t('system.user.table.columns.operation'),
      align: 'center',
      slots: { default: 'ACTION' },
      fixed: 'right',
    },
  ]
}

/**
 * 定义表单数据
 * @returns
 */
export function formSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      dependencies: {
        show: () => false,
        triggerFields: [''],
      },
      fieldName: 'id',
    },
    {
      component: 'Input',
      fieldName: 'user_name',
      label: $t('system.user.form.user_name'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.user_name'),
      },
      rules: 'required',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.form.password'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.password'),
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'real_name',
      label: $t('system.user.form.real_name'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.real_name'),
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'mobile_phone',
      label: $t('system.user.form.mobile_phone'),
      defaultValue: undefined,
      componentProps: {
        placeholder: $t('system.user.form.placeholder.mobile_phone'),
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      defaultValue: undefined,
      label: $t('system.user.form.email'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.email'),
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '男', value: 0 },
          { label: '女', value: 1 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
      fieldName: 'sex',
      label: $t('system.user.form.sex'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'enabled',
      label: $t('system.user.form.enabled'),
    },
    {
      component: 'TreeSelect',
      componentProps: {
        code: 'dept',
        clearable: true,
        multiple: true,
        placeholder: $t('system.user.form.placeholder.dept_name'),
      },
      fieldName: 'dept_id',
      label: $t('system.user.form.dept_id'),
    },
    {
      component: 'Select',
      componentProps: {
        mode: 'multiple',
        allowClear: true,
        placeholder: $t('system.user.form.placeholder.post_name'),
      },
      fieldName: 'post_id_list',
      label: $t('system.user.form.post_name'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        mode: 'multiple',
        allowClear: true,
        api: '/system/role/list',
        class: 'w-full',
        labelField: 'label',
        valueField: 'value',
        placeholder: $t('system.user.form.placeholder.role_name'),
      },
      fieldName: 'role_id_list',
      label: $t('system.user.form.role_name'),
      rules: 'selectRequired',
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.user.form.remark'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.remark'),
      },
    },
  ]
}
