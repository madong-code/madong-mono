import type { CrudSchema } from '#/components/crud/components/types';

import { TenantMemberAdminApi } from '#/api/tenant/member-admin';
import { TenantService } from '#/api/tenant/account';
import { DictEnum } from '#/enums';
import { formatDateTime } from '#/utils/tools';
import { formSchamas } from './form';

export const useCrudAdminSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: TenantMemberAdminApi.list,
      add: TenantMemberAdminApi.create,
      edit: TenantMemberAdminApi.update,
      remove: TenantMemberAdminApi.delete,
      batchRemove: TenantMemberAdminApi.remove,
      view: TenantMemberAdminApi.get,
    },

    hasAdd: false,
    hasEdit: true,
    hasRemove: true,
    hasView: false,
    permissions: {
      add: 'platform:tenant_member_admin:create',
      edit: 'platform:tenant_member_admin:edit',
      remove: 'platform:tenant_member_admin:delete',
    },

    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'id',
        title: 'ID',
        width: 150,
        visible: false,
      },
      {
        field: 'tenant_name',
        title: '关联租户',
        minWidth: 90,
      },
      {
        field: 'role',
        title: '管理员类型',
        minWidth: 80,
        cellRender: {
          name: 'CellTag',
          attrs: {
            options: [
              { value: 'owner', label: '拥有者', color: 'primary' },
              { value: 'admin', label: '管理员', color: 'warning' },
              { value: 'member', label: '成员', color: 'info' },
            ],
          },
        },
      },
      {
        field: 'is_default',
        title: '默认租户',
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_YES_NO },
        },
      },
      {
        field: 'priority',
        title: '排序',
      },
      {
        field: 'created_at',
        title: '创建时间',
        width: 150,
        formatter: ({ cellValue }: any) => formatDateTime(cellValue),
      },
      {
        field: 'updated_at',
        title: '更新时间',
        width: 150,
        visible: false,
        formatter: ({ cellValue }: any) => formatDateTime(cellValue),
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Select',
          fieldName: 'role',
          label: '管理员类型',
          componentProps: {
            options: [
              { label: '拥有者', value: 'owner' },
              { label: '管理员', value: 'admin' },
              { label: '成员', value: 'member' },
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
      schema: formSchamas(),
      onOpen: async (_type, data, formApi) => {
        const adminId = data?.admin_id || 0;
        try {
          const res = await TenantService.list({ format: 'select', limit: 9999, admin_id: adminId });
          const options = Array.isArray(res) ? res : [];
          formApi?.updateSchema([
            {
              fieldName: 'tenant_id',
              componentProps: {
                options,
                filterable: true,
                placeholder: '请选择租户（可搜索）',
              },
            },
          ]);
        } catch {
          // ignore
        }
      },
    },
  };
};
