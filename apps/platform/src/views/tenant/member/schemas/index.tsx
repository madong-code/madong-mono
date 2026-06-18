import type { TenantMemberApi } from '#/api/tenant/member-for-tenant';
import type { CrudSchema } from '#/components/crud/components/types';

import { DictEnum } from '#/enums';
import { $t } from '#/locales';

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
      {
        field: 'user_name',
        title: $t('tenant.member.columns.user_name'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'real_name',
        title: $t('tenant.member.columns.real_name'),
        minWidth: 100,
        align: 'left',
      },
      {
        field: 'mobile_phone',
        title: $t('tenant.member.columns.mobile_phone'),
        minWidth: 120,
      },
      {
        field: 'enabled',
        title: $t('tenant.member.columns.enabled'),
        width: 80,
        slots: { default: 'enabled_switch' },
      },
      {
        field: 'is_locked',
        title: $t('tenant.member.columns.is_locked'),
        width: 90,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_YES_NO },
        },
      },
      {
        field: 'created_date',
        title: $t('tenant.member.columns.created_date'),
        width: 160,
        visible: false,
        formatter: 'formatDateTime',
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_user_name',
          label: $t('tenant.member.search.user_name'),
          componentProps: {
            placeholder: $t('tenant.member.search.placeholder.user_name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_real_name',
          label: $t('tenant.member.search.real_name'),
          componentProps: {
            placeholder: $t('tenant.member.search.placeholder.real_name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'mobile_phone',
          label: $t('tenant.member.search.mobile_phone'),
          componentProps: {
            placeholder: $t('tenant.member.search.placeholder.mobile_phone'),
          },
        },
        {
          component: 'Select',
          fieldName: 'enabled',
          label: $t('tenant.member.search.enabled'),
          componentProps: {
            options: [
              { label: $t('tenant.member.options.enabled.enable'), value: 1 },
              { label: $t('tenant.member.options.enabled.disable'), value: 0 },
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
          label: $t('tenant.member.form.user_name'),
          component: 'Input',
          rules: 'required',
          componentProps: (_values: any) => ({
            placeholder: $t('tenant.member.form.placeholder_user_name'),
          }),
        },
        {
          fieldName: 'password',
          label: $t('tenant.member.form.password'),
          component: 'Password',
          componentProps: (values: any) => ({
            placeholder: values?.id
              ? $t('tenant.member.form.placeholder_password_edit')
              : $t('tenant.member.form.placeholder_password_add'),
          }),
          dependencies: {
            show: (values: any) => !values?.id,
            triggerFields: ['id'],
          },
        },
        {
          fieldName: 'real_name',
          label: $t('tenant.member.form.real_name'),
          component: 'Input',
          rules: 'required',
          componentProps: (_values: any) => ({
            placeholder: $t('tenant.member.form.placeholder_real_name'),
          }),
        },
        {
          fieldName: 'mobile_phone',
          label: $t('tenant.member.form.mobile_phone'),
          component: 'Input',
          componentProps: (_values: any) => ({
            placeholder: $t('tenant.member.form.placeholder_mobile_phone'),
          }),
        },
        {
          fieldName: 'email',
          label: $t('tenant.member.form.email'),
          component: 'Input',
          componentProps: (_values: any) => ({
            placeholder: $t('tenant.member.form.placeholder_email'),
          }),
        },
        {
          fieldName: 'is_super',
          label: $t('tenant.member.form.type'),
          component: 'Select',
          defaultValue: 0,
          componentProps: (_values: any) => ({
            options: [
              { label: $t('tenant.member.form.type_user'), value: 0 },
              { label: $t('tenant.member.form.type_admin'), value: 1 },
            ],
          }),
        },
        {
          fieldName: 'sex',
          label: $t('tenant.member.form.sex'),
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
          label: $t('tenant.member.form.enabled'),
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
          label: $t('tenant.member.form.remark'),
          component: 'Textarea',
          componentProps: (_values: any) => ({
            placeholder: $t('tenant.member.form.placeholder_remark'),
          }),
        },
      ],
    },
  };
};
