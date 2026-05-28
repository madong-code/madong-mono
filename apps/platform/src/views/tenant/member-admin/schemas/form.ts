export function formSchamas() {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: { show: false, triggerFields: ['id'] },
    },
    {
      fieldName: 'admin_id',
      component: 'Input',
      dependencies: { show: false, triggerFields: ['admin_id'] },
      defaultValue: 0,
    },
    {
      fieldName: 'tenant_id',
      label: '关联租户',
      component: 'Select',
      defaultValue: undefined,
      componentProps: {
        filterable: true,
        placeholder: '请选择租户',
      },
      rules: 'required',
    },
    {
      fieldName: 'role',
      label: '管理员类型',
      component: 'Select',
      defaultValue: 'member',
      componentProps: {
        options: [
          { label: '拥有者', value: 'owner' },
          { label: '管理员', value: 'admin' },
          { label: '成员', value: 'member' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'is_default',
      label: '默认租户',
      component: 'RadioGroup',
      defaultValue: 0,
      componentProps: {
        radioType: 'button',
        buttonStyle: 'solid',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      rules: 'required',
    },
  ];
}
