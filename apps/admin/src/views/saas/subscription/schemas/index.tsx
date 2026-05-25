import type { CrudSchema } from '#/components/crud/components/types';
import type { Ref } from 'vue';

import { SubscriptionService } from '#/api/saas/subscription';

export const useCrudSchema = (options: {
  bindTenantVisible: Ref<boolean>;
  bindTenantRow: Ref<any>;
  authorizeVisible: Ref<boolean>;
  authorizeRow: Ref<any>;
}): CrudSchema => {
  const { bindTenantVisible, bindTenantRow, authorizeVisible, authorizeRow } = options;

  return {
    crudApi: {
      list: SubscriptionService.list,
      add: SubscriptionService.create,
      edit: SubscriptionService.update,
      remove: SubscriptionService.delete,
      view: SubscriptionService.get,
    },

    hasAdd: true,
    hasEdit: true,
    hasRemove: true,

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'name', title: '套餐名称', minWidth: 120 },
      {
        field: 'status',
        title: '状态',
        minWidth: 80,
        componentProps: {
          options: [
            { label: '正常', value: 'active' },
            { label: '禁用', value: 'disabled' },
          ],
        },
      },
      { field: 'price', title: '价格/月', minWidth: 80 },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      schema: [
        {
          component: 'Input',
          fieldName: 'LIKE_name',
          label: '套餐名称',
          componentProps: { placeholder: '请输入套餐名称' },
        },
      ],
    },

    formDialog: {
      wrapperClass: 'grid-cols-1',
      dialogType: 'drawer',
      commonConfig: { labelWidth: 90 },
      schema: [
        {
          fieldName: 'id',
          label: 'ID',
          component: 'Input',
          formItemClass: 'col-span-1',
          dependencies: { triggerFields: ['id'], show: false },
        },
        { fieldName: 'name', label: '套餐名称', component: 'Input', rules: 'required', formItemClass: 'col-span-1' },
        {
          fieldName: 'status',
          label: '状态',
          component: 'Select',
          rules: 'required',
          defaultValue: 'active',
          componentProps: {
            options: [
              { label: '正常', value: 'active' },
              { label: '禁用', value: 'disabled' },
            ],
          },
          formItemClass: 'col-span-1',
        },
        { fieldName: 'price', label: '价格/月', component: 'InputNumber', componentProps: { min: 0, precision: 2 }, formItemClass: 'col-span-1' },
      ],
    },

    tableActions: [
      {
        label: '关联租户',
        icon: 'ant-design:link-outlined',
        onClick: (_e: any, row: any) => {
          bindTenantRow.value = row;
          bindTenantVisible.value = true;
        },
      },
      {
        label: '授权',
        icon: 'ant-design:safety-certificate-outlined',
        onClick: (_e: any, row: any) => {
          authorizeRow.value = row;
          authorizeVisible.value = true;
        },
      },
    ],
  };
};
