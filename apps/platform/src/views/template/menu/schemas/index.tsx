import type { CrudSchema } from '#/components/crud/components/types';

import { MenuTemplateService } from '#/api/template/menu';
import { Icon } from '#/components/icon';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

function arrayToTree(
  data: any[],
  idKey = 'id',
  pidKey = 'pid',
  childrenKey = 'children',
): any[] {
  const map = new Map<any, any>();
  const roots: any[] = [];

  data.forEach((item) => {
    map.set(item[idKey], { ...item, [childrenKey]: [] });
  });

  data.forEach((item) => {
    const node = map.get(item[idKey]);
    if (
      item[pidKey] === null ||
      item[pidKey] === undefined ||
      item[pidKey] === 0
    ) {
      roots.push(node);
    } else {
      const parent = map.get(item[pidKey]);
      if (parent) {
        parent[childrenKey].push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: MenuTemplateService.list,
      add: MenuTemplateService.create,
      edit: MenuTemplateService.update,
      remove: MenuTemplateService.delete,
      batchRemove: MenuTemplateService.batchRemove,
      view: MenuTemplateService.get,
    },

    rowKey: 'id',
    hasAdd: true,
    hasEdit: true,
    hasView: false,
    hasRemove: true,
    hasBatchRemove: true,
    tree: { id: 'id', pid: 'pid', children: 'children', reserve: true },
    beforeFetch: (params: any) => {
      return params;
    },
    afterFetch: (res: any) => {
      const items = Array.isArray(res) ? res : res?.items || [];
      return {
        items: arrayToTree(items),
        total: items.length,
      };
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'title',
        title: $t('template.menu.table.columns.title'),
        minWidth: 200,
        treeNode: true,
        align: 'left',
        slots: {
          default: ({ row }: any) => (
            <span>
              <Icon class="mr-1" icon={row.icon} />
              {row.title}
            </span>
          ),
        },
      },
      {
        field: 'code',
        title: $t('template.menu.table.columns.code'),
        minWidth: 120,
        align: 'left',
      },
      {
        field: 'type',
        title: $t('template.menu.table.columns.type'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_MENU_TYPE },
        },
      },
      {
        field: 'path',
        title: $t('template.menu.table.columns.path'),
        minWidth: 150,
        align: 'left',
      },
      {
        field: 'component',
        title: $t('template.menu.table.columns.component'),
        minWidth: 150,
        align: 'left',
      },
      {
        field: 'sort',
        title: $t('template.menu.table.columns.sort'),
        minWidth: 60,
      },
      {
        field: 'is_show',
        title: $t('template.menu.table.columns.is_show'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_YES_NO },
        },
      },
      {
        field: 'enabled',
        title: $t('template.menu.table.columns.enabled'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_ENABLED_STATUS },
        },
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'Select',
          fieldName: 'app',
          label: $t('template.menu.table.search.app'),
          defaultValue: 'admin',
          componentProps: {
            options: [
              {
                label: $t('template.menu.table.search.app_options.admin'),
                value: 'admin',
              },
              {
                label: $t('template.menu.table.search.app_options.platform'),
                value: 'platform',
              },
            ],
            clearable: true,
            placeholder: $t('template.menu.table.search.placeholder.app'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_type',
          label: $t('template.menu.table.search.type'),
          componentProps: {
            code: DictEnum.SYS_MENU_TYPE,
            clearable: true,
            placeholder: $t('template.menu.table.search.placeholder.type'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('template.menu.table.search.enabled'),
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            clearable: true,
            placeholder: $t('template.menu.table.search.placeholder.enabled'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_title',
          label: $t('template.menu.table.search.title'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.menu.table.search.placeholder.title'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: $t('template.menu.table.search.code'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.menu.table.search.placeholder.code'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_path',
          label: $t('template.menu.table.search.path'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.menu.table.search.placeholder.path'),
          },
        },
      ],
    },

    // formDialog: {
    //   enabled: true,
    //   width: 'w-[60%]',
    //   dialogType: 'drawer',
    //   wrapperClass: 'grid-cols-2',
    //   commonConfig: {
    //     labelWidth: 80,
    //     labelAlign: 'right',
    //   },
    //   schema: [
    //     {
    //       label: $t('template.menu.table.columns.id'),
    //       fieldName: 'id',
    //       component: 'Input',
    //       formItemClass: 'col-span-2',
    //       dependencies: {
    //         triggerFields: ['id'],
    //         show: false,
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.type'),
    //       fieldName: 'type',
    //       component: 'ApiDict',
    //       defaultValue: 1,
    //       formItemClass: 'col-span-2',
    //       rules: 'required',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.type'),
    //         code: 'sys_menu_type',
    //         isBtn: true,
    //         renderType: 'RadioGroup',
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.pid'),
    //       fieldName: 'pid',
    //       component: 'ApiTreeSelect',
    //       formItemClass: 'col-span-1',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.pid'),
    //         clearable: true,
    //         checkStrictly: true,
    //         api: '/template/menu/tree',
    //         requestMethod: 'get',
    //         labelField: 'title',
    //         valueField: 'id',
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.title'),
    //       fieldName: 'title',
    //       component: 'Input',
    //       formItemClass: 'col-span-1',
    //       rules: 'required',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.title'),
    //         clearable: true,
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.code'),
    //       fieldName: 'code',
    //       component: 'Input',
    //       formItemClass: 'col-span-1',
    //       rules: 'required',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.code'),
    //         clearable: true,
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.path'),
    //       fieldName: 'path',
    //       component: 'Input',
    //       formItemClass: 'col-span-1',
    //       help: $t('template.menu.form.help.path'),
    //       componentProps: (values: any) => {
    //         return {
    //           placeholder: $t('template.menu.form.placeholder.path'),
    //           clearable: true,
    //           disabled: ![1, 2, 4].includes(values.type),
    //         };
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.component'),
    //       fieldName: 'component',
    //       component: 'Input',
    //       formItemClass: 'col-span-1',
    //       componentProps: (values: any) => {
    //         return {
    //           placeholder: $t(
    //             'template.menu.form.placeholder.component',
    //           ),
    //           clearable: true,
    //           disabled: ![1, 2].includes(values.type),
    //         };
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.open_type'),
    //       fieldName: 'open_type',
    //       component: 'ApiDict',
    //       defaultValue: 1,
    //       formItemClass: 'col-span-1',
    //       rules: 'required',
    //       componentProps: (values: any) => {
    //         return {
    //           placeholder: $t(
    //             'template.menu.form.placeholder.open_type',
    //           ),
    //           code: 'sys_menu_open_type',
    //           isBtn: true,
    //           renderType: 'RadioGroup',
    //           disabled: values.type !== 2,
    //         };
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.icon'),
    //       fieldName: 'icon',
    //       component: 'IconPicker',
    //       formItemClass: 'col-span-1',
    //       componentProps: (values: any) => {
    //         return {
    //           class: 'w-full',
    //           placeholder: $t('template.menu.form.placeholder.icon'),
    //           clearable: true,
    //           disabled: ![1, 2].includes(values.type),
    //         };
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.link_url'),
    //       fieldName: 'link_url',
    //       component: 'Input',
    //       formItemClass: 'col-span-1',
    //       help: $t('template.menu.form.help.link_url'),
    //       componentProps: (values: any) => {
    //         return {
    //           placeholder: $t('template.menu.form.placeholder.link_url'),
    //           clearable: true,
    //           disabled: values.type !== 2,
    //         };
    //       },
    //     },
    //     {
    //       fieldName: 'sort',
    //       label: $t('template.menu.form.modal.sort'),
    //       component: 'InputNumber',
    //       formItemClass: 'col-span-1',
    //       defaultValue: 999,
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.sort'),
    //         clearable: true,
    //         min: 0,
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.enabled'),
    //       fieldName: 'enabled',
    //       component: 'ApiDict',
    //       defaultValue: 1,
    //       formItemClass: 'col-span-1',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.enabled'),
    //         code: 'yes_no',
    //         isBtn: true,
    //         renderType: 'RadioGroup',
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.is_show'),
    //       fieldName: 'is_show',
    //       component: 'ApiDict',
    //       defaultValue: 1,
    //       formItemClass: 'col-span-1',
    //       componentProps: (values: any) => {
    //         return {
    //           placeholder: $t('template.menu.form.placeholder.is_show'),
    //           code: 'yes_no',
    //           isBtn: true,
    //           renderType: 'RadioGroup',
    //           disabled: ![1, 2].includes(values.type),
    //         };
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.is_sync'),
    //       fieldName: 'is_sync',
    //       component: 'ApiDict',
    //       defaultValue: 0,
    //       formItemClass: 'col-span-1',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.is_sync'),
    //         code: 'yes_no',
    //         isBtn: true,
    //         renderType: 'RadioGroup',
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.is_cache'),
    //       fieldName: 'is_cache',
    //       component: 'ApiDict',
    //       defaultValue: 0,
    //       formItemClass: 'col-span-1',
    //       componentProps: (values: any) => {
    //         return {
    //           placeholder: $t('template.menu.form.placeholder.is_cache'),
    //           code: 'yes_no',
    //           isBtn: true,
    //           renderType: 'RadioGroup',
    //           disabled: ![1, 2].includes(values.type),
    //         };
    //       },
    //     },
    //     {
    //       label: $t('template.menu.form.modal.is_affix'),
    //       fieldName: 'is_affix',
    //       component: 'ApiDict',
    //       defaultValue: 0,
    //       formItemClass: 'col-span-1',
    //       componentProps: {
    //         placeholder: $t('template.menu.form.placeholder.is_affix'),
    //         code: 'yes_no',
    //         isBtn: true,
    //         renderType: 'RadioGroup',
    //       },
    //     },
    //   ],
    // },
    formDialog: {
      enabled: true,
      title: $t('template.menu.title'),
      width: 'w-[60%]',
      dialogType: 'drawer',
      wrapperClass: 'grid-cols-2',
      commonConfig: {
        labelWidth: 80,
        labelAlign: 'right',
      },
      schema: [
        {
          label: $t('template.menu.table.columns.id'),
          fieldName: 'id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: {
            triggerFields: ['id'],
            show: false,
          },
        },
        {
          label: $t('template.menu.form.modal.type'),
          fieldName: 'type',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-2',
          rules: 'required',
          componentProps: (_value) => {
            return {
              placeholder: $t('template.menu.form.placeholder.type'),
              code: DictEnum.SYS_MENU_TYPE,
              isBtn: true,
              renderType: 'RadioGroup',
              onChange: (val: any) => {
                if (val !== 2) {
                  _value.openType = 0;
                }
              },
            };
          },
        },
        {
          label: $t('template.menu.form.modal.app'),
          fieldName: 'app',
          component: 'ApiTreeSelect',
          defaultValue: 'admin',
          formItemClass: 'col-span-2',
          rules: 'required',
          componentProps: (_value) => {
            return {
              api: '/system/menu/app/list',
              requestMethod: 'get',
              placeholder: $t('template.menu.form.placeholder.app'),
              style: {
                width: '330px',
              },
              labelField: 'label',
              valueField: 'value',
              onChange: (_values: any) => {
                _value.pid = '';
              },
            };
          },
        },
        {
          label: $t('template.menu.form.modal.pid'),
          fieldName: 'pid',
          component: 'ApiTreeSelect',
          formItemClass: 'col-span-1',
          componentProps: (_value) => {
            return {
              placeholder: $t('template.menu.form.placeholder.pid'),
              clearable: true,
              disabled: !_value?.app,
              checkStrictly: true,
              api: '/template/menu/tree',
              requestMethod: 'get',
              params: {
                app: _value.app || 'admin',
              },
              labelField: 'title',
              valueField: 'id',
            };
          },
        },
        {
          label: $t('template.menu.form.modal.title'),
          fieldName: 'title',
          component: 'Input',
          formItemClass: 'col-span-1',
          rules: 'required',
          componentProps: {
            placeholder: $t('template.menu.form.placeholder.title'),
            clearable: true,
          },
        },
        {
          label: $t('template.menu.form.modal.code'),
          fieldName: 'code',
          component: 'Input',
          formItemClass: 'col-span-1',
          rules: 'required',
          componentProps: {
            placeholder: $t('template.menu.form.placeholder.code'),
            clearable: true,
          },
        },
        {
          label: $t('template.menu.form.modal.path'),
          fieldName: 'path',
          component: 'Input',
          formItemClass: 'col-span-1',
          help: $t('template.menu.form.help.path'),
          componentProps: (values) => {
            return {
              placeholder: $t('template.menu.form.placeholder.path'),
              clearable: true,
              disabled: ![1, 2, 4].includes(values.type),
            };
          },
        },
        {
          label: $t('template.menu.form.modal.component'),
          fieldName: 'component',
          component: 'Input',
          formItemClass: 'col-span-1',
          componentProps: (values) => {
            return {
              placeholder: $t('template.menu.form.placeholder.component'),
              clearable: true,
              disabled: ![1, 2].includes(values.type),
            };
          },
        },
        {
          label: $t('template.menu.form.modal.open_type'),
          fieldName: 'openType',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          rules: 'required',
          dependencies: {
            triggerFields: ['type'],
            rules: (value: any) => (value.type === 2 ? 'required' : null),
          },
          componentProps: (values) => {
            return {
              placeholder: $t('template.menu.form.placeholder.open_type'),
              code: DictEnum.SYS_MENU_OPEN_TYPE,
              isBtn: true,
              renderType: 'RadioGroup',
              disabled: values.type !== 2,
            };
          },
        },
        {
          label: $t('template.menu.form.modal.icon'),
          fieldName: 'icon',
          component: 'IconPicker',
          formItemClass: 'col-span-1',
          componentProps: (values) => {
            return {
              class: 'w-full',
              placeholder: $t('template.menu.form.placeholder.icon'),
              clearable: true,
              disabled: ![1, 2].includes(values.type),
            };
          },
        },
        {
          label: $t('template.menu.form.modal.link_url'),
          fieldName: 'url',
          component: 'Input',
          formItemClass: 'col-span-1',
          help: $t('template.menu.form.help.link_url'),
          componentProps: (values) => {
            return {
              placeholder: $t('template.menu.form.placeholder.link_url'),
              clearable: true,
              disabled: ![2, 3].includes(values.openType),
            };
          },
        },
        {
          label: $t('template.menu.form.modal.sort'),
          fieldName: 'sort',
          component: 'InputNumber',
          formItemClass: 'col-span-1',
          defaultValue: 999,
          componentProps: {
            placeholder: $t('template.menu.form.placeholder.sort'),
            clearable: true,
            min: 0,
          },
        },
        {
          label: $t('template.menu.form.modal.enabled'),
          fieldName: 'enabled',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: {
            placeholder: $t('template.menu.form.placeholder.enabled'),
            code: DictEnum.SYS_ENABLED_STATUS,
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
        {
          label: $t('template.menu.form.modal.is_show'),
          fieldName: 'isShow',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: (values) => {
            return {
              placeholder: $t('template.menu.form.placeholder.is_show'),
              code: DictEnum.SYS_YES_NO,
              isBtn: true,
              renderType: 'RadioGroup',
              disabled: ![1, 2].includes(values.type),
            };
          },
        },
        {
          label: $t('template.menu.form.modal.is_sync'),
          fieldName: 'isSync',
          component: 'ApiDict',
          defaultValue: 0,
          formItemClass: 'col-span-1',
          componentProps: {
            placeholder: $t('template.menu.form.placeholder.is_sync'),
            code: DictEnum.SYS_YES_NO,
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
        {
          label: $t('template.menu.form.modal.is_cache'),
          fieldName: 'isCache',
          component: 'ApiDict',
          defaultValue: 0,
          formItemClass: 'col-span-1',
          componentProps: (values) => {
            return {
              placeholder: $t('template.menu.form.placeholder.is_cache'),
              code: DictEnum.SYS_YES_NO,
              isBtn: true,
              renderType: 'RadioGroup',
              disabled: ![1, 2].includes(values.type),
            };
          },
        },
      ],
    },
  };
};
