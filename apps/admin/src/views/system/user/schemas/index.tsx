import type { VbenFormSchema } from '#/adapter/form'
import { z } from '#/adapter/form'

import { DictEnum } from '#/enums'
import { $t } from '#/locales'

export const dialogTitle = $t('system.user.title')

/**
 * 搜索表单
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
 * 表格列定义
 */
export function useColumns() {
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
      width: 280,
      title: $t('system.user.table.columns.operation'),
      align: 'center',
      slots: { default: 'ACTION' },
      fixed: 'right',
    },
  ]
}

/**
 * 新增/编辑表单 Schema
 * - 密码字段仅在新增时显示（无 id 时）
 * - 确认密码仅在新增时显示
 * - viewComponent/viewComponentProps 用于详情模式展示
 */
export function formSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      label: 'id',
      hide: true,
      hideInDetail: true,
    },
    {
      component: 'Input',
      fieldName: 'user_name',
      label: $t('system.user.form.user_name'),
      rules: 'required',
      componentProps: {
        placeholder: $t('system.user.form.placeholder.user_name'),
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.form.password'),
      rules: 'required',
      hideInDetail: true,
      componentProps: {
        placeholder: $t('system.user.form.placeholder.password'),
      },
      dependencies: {
        // 仅新增时显示（无 id）
        if(values) {
          return !values.id
        },
        triggerFields: ['id'],
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'confirmPassword',
      label: $t('system.user.form.confirm_password'),
      rules: 'required',
      hideInDetail: true,
      componentProps: {
        placeholder: $t('system.user.form.placeholder.confirm_password'),
      },
      dependencies: {
        // 仅新增时显示
        if(values) {
          return !values.id
        },
        triggerFields: ['id'],
        // 确认密码一致性校验
        rules(values) {
          return z.string().min(1).refine(
            (val) => !values.password || val === values.password,
            { message: '两次输入的密码不一致' },
          )
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'real_name',
      label: $t('system.user.form.real_name'),
      rules: 'required',
      componentProps: {
        placeholder: $t('system.user.form.placeholder.real_name'),
      },
    },
    {
      component: 'Input',
      fieldName: 'nick_name',
      label: $t('system.user.form.nick_name'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.nick_name'),
      },
    },
    {
      component: 'ApiDict',
      fieldName: 'sex',
      label: $t('system.user.form.sex'),
      componentProps: {
        code: DictEnum.SYS_SEX,
        renderType: 'RadioGroup',
        isBtn: true,
        clearable: true,
      },
      defaultValue: 3,
      viewComponent: 'ApiDict',
      viewComponentProps: { code: DictEnum.SYS_SEX },
    },
    {
      component: 'Input',
      fieldName: 'mobile_phone',
      label: $t('system.user.form.mobile_phone'),
      rules: 'required',
      componentProps: {
        placeholder: $t('system.user.form.placeholder.mobile_phone'),
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.form.email'),
      componentProps: {
        placeholder: $t('system.user.form.placeholder.email'),
      },
    },
    {
      component: 'ApiTreeSelect',
      fieldName: 'dept_id',
      label: $t('system.user.form.dept_id'),
      rules: 'selectRequired',
      componentProps: {
        code: 'dept',
        clearable: true,
        multiple: true,
        placeholder: $t('system.user.form.placeholder.dept_name'),
      },
      viewComponent: 'ApiDict',
      viewComponentProps: { code: 'dept' },
    },
    {
      component: 'ApiSelect',
      fieldName: 'post_id_list',
      label: $t('system.user.form.post_name'),
      componentProps: {
        mode: 'multiple',
        allowClear: true,
        placeholder: $t('system.user.form.placeholder.post_name'),
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'role_id_list',
      label: $t('system.user.form.role_name'),
      rules: 'selectRequired',
      componentProps: {
        mode: 'multiple',
        allowClear: true,
        api: '/system/role/list',
        labelField: 'label',
        valueField: 'value',
        placeholder: $t('system.user.form.placeholder.role_name'),
      },
    },
    {
      component: 'ApiDict',
      fieldName: 'enabled',
      label: $t('system.user.form.enabled'),
      componentProps: {
        code: DictEnum.SYS_ENABLED_STATUS,
        renderType: 'RadioGroup',
        isBtn: true,
      },
      defaultValue: 1,
      viewComponent: 'ApiDict',
      viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.user.form.remark'),
      formItemClass: 'col-span-1 md:col-span-2',
      componentProps: {
        placeholder: $t('system.user.form.placeholder.remark'),
      },
    },
  ]
}

/**
 * 授权角色表单 Schema
 */
export function grantRoleFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'userId',
      label: 'userId',
      hide: true,
      hideInDetail: true,
    },
    {
      component: 'ApiSelect',
      fieldName: 'roleIdList',
      label: $t('system.user.form.role_name'),
      rules: 'selectRequired',
      componentProps: {
        mode: 'multiple',
        allowClear: true,
        api: '/system/role/list',
        labelField: 'label',
        valueField: 'value',
        placeholder: $t('system.user.form.placeholder.role_name'),
      },
    },
  ]
}
