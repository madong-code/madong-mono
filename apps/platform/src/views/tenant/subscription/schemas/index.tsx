import type { CrudSchema } from '#/components/crud/components/types';

import { SubscriptionService } from '#/api/tenant/subscription';

export const useCrudSchema = (options: {
  bindTenantDrawerApi: { setData: (data: any) => any; open: () => void };
  authDrawerApi: { setData: (data: any) => any; open: () => void };
  onRefresh: () => void;
}): CrudSchema => {
  const { bindTenantDrawerApi, authDrawerApi, onRefresh } = options;

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
    hasView: true,

    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'name', title: '套餐名称', minWidth: 140 },
      { field: 'code', title: '套餐代码', width: 120 },
      {
        field: 'status',
        title: '状态',
        width: 100,
        componentProps: {
          options: [
            { label: '正常', value: 'active' },
            { label: '禁用', value: 'disabled' },
          ],
        },
      },
      { field: 'price', title: '价格/月', width: 100 },
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
      dialogType: 'drawer',
      commonConfig: { labelWidth: 90 },
      schema: [
        { fieldName: 'id', label: 'ID', component: 'Input', dependencies: { triggerFields: ['id'], show: false } },
        { fieldName: 'name', label: '套餐名称', component: 'Input', rules: 'required' },
        { fieldName: 'code', label: '套餐代码', component: 'Input', rules: 'required' },
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
        },
        { fieldName: 'price', label: '价格/月', component: 'InputNumber', componentProps: { min: 0, precision: 2 } },
        { fieldName: 'price_year', label: '价格/年', component: 'InputNumber', componentProps: { min: 0, precision: 2 } },
        { fieldName: 'max_users', label: '最大用户', component: 'InputNumber', componentProps: { min: 0 } },
        { fieldName: 'description', label: '描述', component: 'Textarea', componentProps: { rows: 3 } },
      ],
    },

    // 更多 → 下拉菜单
    dropDownActions: [
      {
        label: '关联租户',
        type: null,
        icon: 'ant-design:link-outlined',
        onClick: (_e: any, row: any) => {
          bindTenantDrawerApi.setData({ row, onSuccess: onRefresh }).open();
        },
      },
      {
        label: '权限授权',
        type: null,
        icon: 'ant-design:safety-certificate-outlined',
        onClick: (_e: any, row: any) => {
          authDrawerApi.setData({ row, onSuccess: onRefresh }).open();
        },
      },
    ],
  };
};
