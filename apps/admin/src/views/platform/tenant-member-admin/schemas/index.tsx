import type { CrudSchema } from '#/components/crud/components/types';

import { TenantMemberAdminApi } from '#/api/platform/tenant-member-admin';
import { TenantService } from '#/api/platform/tenant';
import { DictEnum } from '#/enums';

export const useCrudAdminSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: TenantMemberAdminApi.list,
      add: TenantMemberAdminApi.create,
      edit: TenantMemberAdminApi.update,
      remove: TenantMemberAdminApi.delete,
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: true,
    hasView: false,

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: 'ID', width: 80 },
      {
        field: 'tenant_name',
        title: '关联租户',
        minWidth: 150,
      },
      {
        field: 'tenant_company_name',
        title: '租户名称',
        minWidth: 150,
      },
      {
        field: 'role',
        title: '管理员类型',
        width: 100,
        componentProps: {
          options: [
            { label: '超级管理员', value: 'admin' },
            { label: '普通成员', value: 'member' },
          ],
        },
      },
      {
        field: 'is_default',
        title: '默认租户',
        width: 90,
        componentProps: {
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
      },
      {
        field: 'created_date',
        title: '创建时间',
        width: 160,
      },
      {
        field: 'updated_date',
        title: '更新时间',
        width: 160,
        visible: false,
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Select',
          fieldName: 'EQ_role',
          label: '管理员类型',
          componentProps: {
            options: [
              { label: '超级管理员', value: 'admin' },
              { label: '普通成员', value: 'member' },
            ],
            clearable: true,
          },
        },
      ],
    },

    formDialog: {
      dialogType: 'modal',
      width: 'w-[40%]',
      commonConfig: { labelWidth: 100 },
      schema: [
        {
          fieldName: 'admin_id',
          component: 'Input',
          dependencies: { show: () => false, triggerFields: ['admin_id'] },
          defaultValue: 0,
        },
        {
          fieldName: 'tenant_id',
          label: '关联租户',
          component: 'Select',
          rules: 'required',
          componentProps: {
            api: async () => {
              const res = await TenantService.list({ format: 'select', limit: 9999 });
              return (res?.data?.list || res?.data || []).map((item: any) => ({
                label: item.name,
                value: item.id,
              }));
            },
            filterable: true,
            placeholder: '请选择租户',
          },
        },
        {
          fieldName: 'role',
          label: '角色',
          component: 'Select',
          rules: 'required',
          defaultValue: 'member',
          componentProps: {
            options: [
              { label: '拥有者', value: 'owner' },
              { label: '管理员', value: 'admin' },
              { label: '成员', value: 'member' },
            ],
          },
        },
        {
          fieldName: 'is_default',
          label: '默认租户',
          component: 'ApiDict',
          defaultValue: 0,
          componentProps: {
            code: DictEnum.SYS_YES_NO,
            isBtn: true,
            renderType: 'RadioGroup'
          },
          help: '登录时默认选中的租户',
        },
      ],
    },
  };
};
