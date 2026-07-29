import type { CrudSchema } from '#/components/crud/components/types';

import { DbSettingService } from '#/api/database';
import { TenantService } from '#/api/tenant/account';
import { $t } from '#/locales';
import { formatDateTime } from '#/utils/tools/format';

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: TenantService.list,
      add: TenantService.create,
      edit: TenantService.update,
      remove: TenantService.delete,
      // 后端以秒级时间戳存储，编辑时转为 Date 对象回填到 DatePicker
      view: async (id: number) => {
        const res = await TenantService.get(id);
        return {
          ...res,
          start_time: res.start_time
            ? new Date(Number(res.start_time) * 1000)
            : null,
          expire_time: res.expire_time
            ? new Date(Number(res.expire_time) * 1000)
            : null,
        };
      },
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: true,
    hasView: true,

    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'id',
        title: $t('tenant.account.columns.id'),
        minWidth: 60,
        visible: false,
      },
      {
        field: 'name',
        title: $t('tenant.account.columns.name'),
        minWidth: 130,
        align: 'left',
      },
      {
        field: 'code',
        title: $t('tenant.account.columns.code'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'domain',
        title: $t('tenant.account.columns.domain'),
        minWidth: 150,
        align: 'left',
      },
      {
        field: 'database_mode',
        title: $t('tenant.account.columns.database_mode'),
        minWidth: 100,
        cellRender: {
          name: 'CellTag',
          attrs: {
            options: [
              {
                label: $t('tenant.account.options.database_mode.field'),
                value: 'field',
                color: 'info',
              },
              {
                label: $t('tenant.account.options.database_mode.database'),
                value: 'database',
                color: 'warning',
              },
            ],
          },
        },
      },
      {
        field: 'db_setting_id',
        title: $t('tenant.account.columns.db_setting_id'),
        minWidth: 120,
        visible: false,
      },
      {
        field: 'status',
        title: $t('tenant.account.columns.status'),
        minWidth: 80,
        cellRender: {
          name: 'CellTag',
          attrs: {
            options: [
              {
                label: $t('tenant.account.options.status.active'),
                value: 'active',
                color: 'success',
              },
              {
                label: $t('tenant.account.options.status.suspended'),
                value: 'suspended',
                color: 'warning',
              },
              {
                label: $t('tenant.account.options.status.cancelled'),
                value: 'cancelled',
                color: 'danger',
              },
            ],
          },
        },
      },
      {
        field: 'start_time',
        title: $t('tenant.account.form.start_time'),
        minWidth: 160,
        slots: {
          default: ({ row }: any) => (
            <span>{row.start_time ? formatDateTime(row.start_time) : '/'}</span>
          ),
        },
      },
      {
        field: 'expire_time',
        title: $t('tenant.account.columns.expire_time'),
        minWidth: 160,
        slots: {
          default: ({ row }: any) => (
            <span>
              {row.expire_time ? formatDateTime(row.expire_time) : '/'}
            </span>
          ),
        },
      },
      {
        field: 'contact_name',
        title: $t('tenant.account.columns.contact_name'),
        minWidth: 100,
      },
      {
        field: 'contact_phone',
        title: $t('tenant.account.columns.contact_phone'),
        minWidth: 120,
      },
      {
        field: 'contact_email',
        title: $t('tenant.account.columns.contact_email'),
        minWidth: 150,
        visible: false,
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('tenant.account.search.name'),
          componentProps: {
            placeholder: $t('tenant.account.search.placeholder.name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: $t('tenant.account.search.code'),
          componentProps: {
            placeholder: $t('tenant.account.search.placeholder.code'),
          },
        },
        {
          component: 'Select',
          fieldName: 'EQ_status',
          label: $t('tenant.account.search.status'),
          componentProps: {
            options: [
              {
                label: $t('tenant.account.options.status.active'),
                value: 'active',
              },
              {
                label: $t('tenant.account.options.status.suspended'),
                value: 'suspended',
              },
              {
                label: $t('tenant.account.options.status.cancelled'),
                value: 'cancelled',
              },
            ],
            clearable: true,
          },
        },
      ],
    },

    formDialog: {
      wrapperClass: 'grid-cols-2',
      dialogType: 'drawer',
      // 提交时将 DatePicker 的 Date 对象转为秒级时间戳
      transformFormValues: (values: Record<string, any>) => {
        const toUnix = (v: any): any => {
          if (v === null || v === undefined || v === '') {
            return null;
          }
          if (v instanceof Date) {
            return Math.floor(v.getTime() / 1000);
          }
          if (typeof v === 'number') {
            return v.toString().length === 10 ? v : Math.floor(v / 1000);
          }
          if (typeof v === 'string') {
            if (/^\d{10}$/.test(v)) {
              return Number(v);
            }
            const t = new Date(v).getTime();
            return Number.isNaN(t) ? null : Math.floor(t / 1000);
          }
          return null;
        };
        return {
          ...values,
          start_time: toUnix(values.start_time),
          expire_time: toUnix(values.expire_time),
        };
      },
      schema: [
        {
          fieldName: 'id',
          label: $t('tenant.account.columns.id'),
          component: 'Input',
          formItemClass: 'col-span-1',
          dependencies: {
            show: false,
            triggerFields: ['id'],
          },
        },
        {
          fieldName: 'base_info',
          hideLabel: true,
          component: 'Divider',
          label: '',
          formItemClass: 'col-span-2',
          componentProps: {
            title: $t('tenant.account.form.divider_base_info'),
          },
        },
        {
          fieldName: 'name',
          label: $t('tenant.account.form.name'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'database_mode',
          label: $t('tenant.account.form.database_mode'),
          component: 'RadioGroup',
          defaultValue: 'field',
          help: $t('tenant.account.form.help_database_mode'),
          componentProps: {
            options: [
              {
                label: $t('tenant.account.options.database_mode.field'),
                value: 'field',
              },
              {
                label: $t('tenant.account.options.database_mode.database'),
                value: 'database',
              },
            ],
            isBtn: true,
          },
          dependencies: {
            triggerFields: ['id'],
            disabled: (_value: any) => _value.id > 0,
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'code',
          label: $t('tenant.account.form.code'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'domain',
          label: $t('tenant.account.form.domain'),
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_name',
          label: $t('tenant.account.form.contact_name'),
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_phone',
          label: $t('tenant.account.form.contact_phone'),
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_email',
          label: $t('tenant.account.form.contact_email'),
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'contact_address',
          label: $t('tenant.account.form.contact_address'),
          component: 'Input',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'system_name',
          label: $t('tenant.account.form.system_name'),
          component: 'Input',
          formItemClass: 'col-span-2',
        },
        {
          fieldName: 'effective_mode',
          label: $t('tenant.account.form.effective_mode'),
          component: 'RadioGroup',
          defaultValue: 'immediate',
          componentProps: {
            options: [
              {
                label: $t('tenant.account.options.effective_mode.immediate'),
                value: 'immediate',
              },
              {
                label: $t('tenant.account.options.effective_mode.specified'),
                value: 'specified',
              },
            ],
            isBtn: true,
          },
          formItemClass: 'col-span-2',
        },
        {
          fieldName: 'start_time',
          label: $t('tenant.account.form.start_time'),
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
          label: $t('tenant.account.form.expire_time'),
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
          label: $t('tenant.account.form.status'),
          component: 'Select',
          componentProps: {
            options: [
              {
                label: $t('tenant.account.options.status.active'),
                value: 'active',
              },
              {
                label: $t('tenant.account.options.status.suspended'),
                value: 'suspended',
              },
              {
                label: $t('tenant.account.options.status.cancelled'),
                value: 'cancelled',
              },
            ],
          },
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'sort',
          label: $t('tenant.account.form.sort'),
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
            title: $t('tenant.account.form.divider_admin_info'),
          },
          dependencies: {
            show: (values) => {
              return !values?.id;
            },
            triggerFields: ['id'],
          },
        },

        {
          component: 'Input',
          fieldName: 'account',
          label: $t('tenant.account.form.account'),
          rules: 'required',
          formItemClass: 'col-span-2',
          dependencies: {
            show: (values) => !values?.id,
            triggerFields: ['id'],
          },
        },
        {
          component: 'Password',
          fieldName: 'password',
          label: $t('tenant.account.form.password'),
          rules: 'required',
          formItemClass: 'col-span-2',
          dependencies: {
            show: (values) => !values?.id,
            triggerFields: ['id'],
          },
        },
        {
          fieldName: 'base_info',
          hideLabel: true,
          component: 'Divider',
          label: '',
          formItemClass: 'col-span-2',
          componentProps: {
            title: $t('tenant.account.form.divider_data_center'),
          },
          dependencies: {
            triggerFields: ['database_mode'],
            show: (_value: any) => _value.database_mode === 'database',
          },
        },
        {
          fieldName: 'db_setting_id',
          label: $t('tenant.account.form.db_setting_id'),
          component: 'ApiSelect',
          help: $t('tenant.account.form.help_db_setting'),
          componentProps: {
            api: async () => {
              const res = await DbSettingService.list({ format: 'select' });
              return res || [];
            },
            clearable: true,
            filterable: true,
            placeholder: $t('tenant.account.form.placeholder_db_setting'),
          },
          formItemClass: 'col-span-2',
          rules: 'selectRequired',
          dependencies: {
            triggerFields: ['database_mode'],
            show: (_value: any) => _value.database_mode === 'database',
          },
        },
      ],
    },
  };
};
