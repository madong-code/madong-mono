import type { CrudSchema } from '#/components/crud/components/types';

import { TenantService } from '#/api/tenant/account';
import { DbSettingService } from '#/api/database';
import { UserService } from '#/api/system/user';
import { $t } from '#/locales';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: TenantService.list,
      add: TenantService.create,
      edit: TenantService.update,
      remove: TenantService.delete,
      view: TenantService.get,
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: true,
    hasView: true,

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'id', title: 'ID', minWidth: 60, visible: false },
      { field: 'name', title: '租户名称', minWidth: 130 },
      { field: 'code', title: '租户编码', minWidth: 120 },
      { field: 'domain', title: '绑定域名', minWidth: 150 },
      {
        field: 'database_mode',
        title: '隔离模式',
        minWidth: 100,
        componentProps: {
          options: [
            { label: '字段隔离', value: 'field' },
            { label: '库隔离', value: 'database' },
          ],
        },
      },
      {
        field: 'db_setting_id',
        title: '关联数据源',
        minWidth: 120,
        visible: false,
      },
      {
        field: 'status',
        title: '状态',
        minWidth: 80,
        componentProps: {
          options: [
            { label: '启用', value: 'active' },
            { label: '暂停', value: 'suspended' },
            { label: '注销', value: 'cancelled' },
          ],
        },
      },
      { field: 'expire_time', title: '到期时间', minWidth: 160 },
      { field: 'contact_name', title: '联系人', minWidth: 100 },
      { field: 'contact_phone', title: '电话', minWidth: 120 },
      { field: 'contact_email', title: '邮箱', minWidth: 150, visible: false },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: '租户名称',
          componentProps: { placeholder: '请输入租户名称' },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: '租户编码',
          componentProps: { placeholder: '请输入编码' },
        },
        {
          component: 'Select',
          fieldName: 'EQ_status',
          label: '状态',
          componentProps: {
            options: [
              { label: '启用', value: 'active' },
              { label: '暂停', value: 'suspended' },
              { label: '注销', value: 'cancelled' },
            ],
            clearable: true,
          },
        },
      ],
    },

    formDialog: {
      wrapperClass: 'grid-cols-2',
      dialogType: 'drawer',
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          formItemClass: 'col-span-1',
          dependencies: {
            show: false, triggerFields: ['id']
          }
        },
        {
          fieldName: 'base_info',
          hideLabel: true,
          component: 'Divider',
          label: '',
          formItemClass: 'col-span-2',
          componentProps: {
            title: '基本信息',
          }

        },
        {
          fieldName: 'name',
          label: '租户名称',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'database_mode',
          label: '隔离模式',
          component: 'RadioGroup',
          defaultValue: 'field',
          help: '字段隔离：数据以 TENANT_ID 区分，共享数据库；库隔离：租户需关联独立数据源，系统将自动创建授权套餐所需的表结构。',
          componentProps: {
            options: [
              { label: '字段隔离', value: 'field' },
              { label: '库隔离', value: 'database' },
            ],
            isBtn: true,
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'code',
          label: '租户编码',
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        { fieldName: 'domain', label: '绑定域名', component: 'Input', formItemClass: 'col-span-1' },
        {
          fieldName: 'contact_name',
          label: '联系人',
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_phone',
          label: '联系电话',
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_email',
          label: '联系邮箱',
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_address',
          label: '联系地址',
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'system_name',
          label: '系统名称',
          component: 'Input',
          formItemClass: 'col-span-2',
        },
        {
          fieldName: 'effective_mode',
          label: '生效方式',
          component: 'RadioGroup',
          defaultValue: 'immediate',
          componentProps: {
            options: [
              { label: '永久生效', value: 'immediate' },
              { label: '指定时间', value: 'specified' },
            ],
            isBtn: true,
          },
          formItemClass: 'col-span-2',
        },
        {
          fieldName: 'start_time',
          label: '生效时间',
          component: 'DatePicker',
          componentProps: { type: 'datetime' },
          formItemClass: 'col-span-1',
          dependencies: {
            triggerFields: ['effective_mode'],
            show: (_value: any) => _value.effective_mode === 'specified',
          },
        },
        {
          fieldName: 'expire_time',
          label: '到期时间',
          component: 'DatePicker',
          componentProps: { type: 'datetime' },
          formItemClass: 'col-span-1',
          dependencies: {
            triggerFields: ['effective_mode'],
            show: (_value: any) => _value.effective_mode === 'specified',
          },
        },
        {
          fieldName: 'status',
          label: '状态',
          component: 'Select',
          componentProps: {
            options: [
              { label: '启用', value: 'active' },
              { label: '暂停', value: 'suspended' },
              { label: '注销', value: 'cancelled' },
            ],
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'sort',
          label: '排序',
          component: 'Input',
          componentProps: { type: 'number' },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'base_info',
          hideLabel: true,
          component: 'Divider',
          label: '',
          formItemClass: 'col-span-2',
          componentProps: {
            title: '账号信息',
          },
          dependencies: {
            show: (values) => {
              return !values?.id
            },
            triggerFields: ['id'],
          },

        },

        {
          component: 'Select',
          fieldName: 'is_create_admin',
          label: "类型",
          defaultValue: 0,
          componentProps: {
            allowClear: true,
            options: [{ value: 0, label: "选择管理员" }, { value: 1, label: "新增管理员" }],
            class: 'w-full',
          },
          dependencies: {
            show: (values) => {
              return !values?.id
            },
            triggerFields: ['id'],
          },
          rules: 'selectRequired',
          formItemClass: "col-span-2",
        },
        {
          fieldName: "admin_id",
          label: "账号",
          component: "Select",
          defaultValue: [],
          componentProps: {
            api: async () => {
              const res = await UserService.list({ limit: 9999, field: 'id,user_name,real_name,mobile_phone' });
              return (res?.items || []).map((item: any) => ({
                label: `${item.real_name || item.user_name}${item.mobile_phone ? ` (${item.mobile_phone})` : ''}`,
                value: item.id,
              }));
            },
            clearable: true,
            filterable: true,
            placeholder: '请输入关键字搜索',
          },
          dependencies: {
            show: (values) => {
              return !values?.id && values?.is_create_admin === 0
            },
            triggerFields: ['id', 'is_create_admin'],
          },
          formItemClass: "col-span-2",
          rules: 'selectRequired',
        },
        {
          component: 'Input',
          fieldName: 'account',
          label: '账号',
          rules: 'required',
          formItemClass: "col-span-2",
          dependencies: {
            show: (values) => {
              return !values?.id && values?.is_create_admin === 1
            },
            triggerFields: ['id', 'is_create_admin'],
          },
        },
        {
          component: 'Password',
          fieldName: 'password',
          label: '密码',
          rules: 'required',
          formItemClass: "col-span-2",
          dependencies: {
            show: (values) => {
              return !values?.id && values?.is_create_admin === 1
            },
            triggerFields: ['id', 'is_create_admin'],
          },
        },
        {
          fieldName: 'base_info',
          hideLabel: true,
          component: 'Divider',
          label: '',
          formItemClass: 'col-span-2',
          componentProps: {
            title: '数据中心',
          },
          dependencies: {
            triggerFields: ['database_mode'],
            show: (_value: any) => _value.database_mode === 'database',
          },

        },
        {
          fieldName: 'db_setting_id',
          label: '关联数据源',
          component: 'Select',
          help: '请先在"数据源管理"中配置数据源',
          componentProps: {
            api: async () => {
              const res = await DbSettingService.list({ format: 'select' });
              return (res?.data || res || []).map((item: any) => ({
                label: `${item.name} (${item.database}@${item.host})`,
                value: item.id,
              }));
            },
            clearable: true,
            filterable: true,
            placeholder: '请选择数据源',
          },
          formItemClass: 'col-span-2',
          dependencies: {
            triggerFields: ['database_mode'],
            show: (_value: any) => _value.database_mode === 'database',
          },
        },
      ],
    },
  };
};
