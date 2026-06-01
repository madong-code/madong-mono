import type { TenantMemberApi } from '#/api/tenant/member-for-tenant';
import type { CrudSchema } from '#/components/crud/components/types';

import { DictEnum } from '#/enums';

export const useCrudSchema = (
  api: ReturnType<typeof TenantMemberApi>,
): CrudSchema => {
  return {
    crudApi: {
      list: api.list,
      add: api.create,
      edit: api.update,
      remove: api.delete,
      view: api.get,
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: false, // 由自定义 dropDownActions 控制
    hasView: true,

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'user_name', title: '账号', minWidth: 100, align: 'left' },
      { field: 'real_name', title: '用户昵称', minWidth: 100, align: 'left' },
      { field: 'mobile_phone', title: '手机号', minWidth: 120 },
      {
        field: 'enabled',
        title: '状态',
        width: 80,
        slots: { default: 'enabled_switch' },
      },
      {
        field: 'is_locked',
        title: '锁定状态',
        width: 90,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_YES_NO },
        },
      },
      {
        field: 'created_date',
        title: '创建时间',
        width: 160,
        visible: false,
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_user_name',
          label: '用户名',
          componentProps: { placeholder: '请输入用户名' },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_real_name',
          label: '姓名',
          componentProps: { placeholder: '请输入姓名' },
        },
        {
          component: 'Input',
          fieldName: 'mobile_phone',
          label: '手机号',
          componentProps: { placeholder: '请输入手机号' },
        },
        {
          component: 'Select',
          fieldName: 'enabled',
          label: '状态',
          componentProps: {
            options: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ],
            clearable: true,
          },
        },
      ],
    },

    formDialog: {
      dialogType: 'modal',
      commonConfig: { labelWidth: 90 },
      schema: [
        {
          fieldName: 'id',
          component: 'Input',
          dependencies: { show: () => false, triggerFields: ['id'] },
        },
        {
          fieldName: 'user_name',
          label: '用户名',
          component: 'Input',
          rules: 'required',
          componentProps: (_values: any) => ({
            placeholder: '请输入用户名',
          }),
        },
        {
          fieldName: 'password',
          label: '密码',
          component: 'Password',
          componentProps: (values: any) => ({
            placeholder: values?.id ? '留空则不修改密码' : '请输入密码',
          }),
          dependencies: {
            show: (values: any) => !values?.id,
            triggerFields: ['id'],
          },
        },
        {
          fieldName: 'real_name',
          label: '姓名',
          component: 'Input',
          rules: 'required',
          componentProps: (_values: any) => ({
            placeholder: '请输入姓名',
          }),
        },
        {
          fieldName: 'mobile_phone',
          label: '手机号',
          component: 'Input',
          componentProps: (_values: any) => ({
            placeholder: '请输入手机号',
          }),
        },
        {
          fieldName: 'email',
          label: '邮箱',
          component: 'Input',
          componentProps: (_values: any) => ({
            placeholder: '请输入邮箱',
          }),
        },
        {
          fieldName: 'is_super',
          label: '类型',
          component: 'Select',
          defaultValue: 0,
          componentProps: (_values: any) => ({
            options: [
              { label: '普通用户', value: 0 },
              { label: '管理员', value: 1 },
            ],
          }),
        },
        {
          fieldName: 'sex',
          label: '性别',
          component: 'ApiDict',
          defaultValue: 0,
          componentProps: (_values: any) => ({
            code: DictEnum.SYS_SEX,
            isBtn: true,
            renderType: 'RadioGroup',
          }),
        },
        {
          fieldName: 'enabled',
          label: '状态',
          component: 'ApiDict',
          defaultValue: 1,
          componentProps: (_values: any) => ({
            code: DictEnum.SYS_ENABLED_STATUS,
            isBtn: true,
            renderType: 'RadioGroup',
          }),
        },
        {
          fieldName: 'remark',
          label: '备注',
          component: 'Textarea',
          componentProps: (_values: any) => ({
            placeholder: '请输入备注',
          }),
        },
      ],
    },
  };
};
