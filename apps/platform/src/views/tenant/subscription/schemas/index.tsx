import type { CrudSchema } from '#/components/crud/components/types';

import { SubscriptionService } from '#/api/tenant/subscription';
import { $t } from '#/locales';

export const useCrudSchema = (options: {
  authDrawerApi: { open: () => void; setData: (data: any) => any };
  bindTenantDrawerApi: { open: () => void; setData: (data: any) => any };
  onRefresh: () => void;
}): CrudSchema => {
  const { bindTenantDrawerApi, authDrawerApi, onRefresh } = options;

  return {
    crudApi: {
      list: SubscriptionService.list,
      add: SubscriptionService.create,
      edit: SubscriptionService.update,
      remove: SubscriptionService.delete,
      batchRemove: SubscriptionService.remove,
      view: SubscriptionService.get,
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: true,
    hasView: true,
    hasBatchRemove: true,

    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'code',
        title: $t('tenant.subscription.columns.code'),
        minWidth: 100,
        width: 200,
        align: 'left',
      },
      {
        field: 'name',
        title: $t('tenant.subscription.columns.name'),
        align: 'left',
      },
      {
        field: 'status',
        title: $t('tenant.subscription.columns.status'),
        width: 100,
        cellRender: {
          name: 'CellTag',
          attrs: {
            options: [
              {
                label: $t('tenant.subscription.options.status.active'),
                value: 'active',
                color: 'success',
              },
              {
                label: $t('tenant.subscription.options.status.disabled'),
                value: 'disabled',
                color: 'info',
              },
            ],
          },
        },
      },
      {
        field: 'max_users',
        title: $t('tenant.subscription.columns.max_users'),
        align: 'right',
      },
      {
        field: 'price',
        title: $t('tenant.subscription.columns.price'),
        width: 100,
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('tenant.subscription.search.name'),
          componentProps: {
            placeholder: $t('tenant.subscription.search.placeholder.name'),
          },
        },
      ],
    },

    formDialog: {
      dialogType: 'drawer',
      commonConfig: { labelWidth: 90 },
      schema: [
        {
          fieldName: 'id',
          label: $t('tenant.subscription.form.id'),
          component: 'Input',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          fieldName: 'name',
          label: $t('tenant.subscription.form.name'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'code',
          label: $t('tenant.subscription.form.code'),
          component: 'Input',
          rules: 'required',
        },
        {
          fieldName: 'status',
          label: $t('tenant.subscription.form.status'),
          component: 'Select',
          rules: 'required',
          defaultValue: 'active',
          componentProps: {
            options: [
              {
                label: $t('tenant.subscription.options.status.active'),
                value: 'active',
              },
              {
                label: $t('tenant.subscription.options.status.disabled'),
                value: 'disabled',
              },
            ],
          },
        },
        {
          fieldName: 'price',
          label: $t('tenant.subscription.form.price'),
          component: 'InputNumber',
          componentProps: { min: 0, precision: 2 },
        },
        {
          fieldName: 'price_year',
          label: $t('tenant.subscription.form.price_year'),
          component: 'InputNumber',
          componentProps: { min: 0, precision: 2 },
        },
        {
          fieldName: 'max_users',
          label: $t('tenant.subscription.form.max_users'),
          component: 'InputNumber',
          componentProps: { min: 0 },
        },
        {
          fieldName: 'description',
          label: $t('tenant.subscription.form.description'),
          component: 'Textarea',
          componentProps: { rows: 3 },
        },
      ],
    },

    // 更多 → 下拉菜单
    dropDownActions: [
      {
        label: $t('tenant.subscription.action.grant_tenant'),
        type: null,
        icon: 'ant-design:link-outlined',
        onClick: (_e: any, row: any) => {
          bindTenantDrawerApi.setData({ row, onSuccess: onRefresh }).open();
        },
      },
      {
        label: $t('tenant.subscription.action.grant_auth'),
        type: null,
        icon: 'ant-design:safety-certificate-outlined',
        onClick: (_e: any, row: any) => {
          authDrawerApi.setData({ row, onSuccess: onRefresh }).open();
        },
      },
    ],
  };
};
