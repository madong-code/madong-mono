import type { CrudSchema } from '#/components/crud/components/types';

import { WebMenuTemplateService } from '#/api/template/web-menu';
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
      item[pidKey] === 0 ||
      item[pidKey] === '0'
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
      list: WebMenuTemplateService.list,
      add: WebMenuTemplateService.create,
      edit: WebMenuTemplateService.update,
      remove: WebMenuTemplateService.delete,
      batchRemove: WebMenuTemplateService.batchRemove,
      view: WebMenuTemplateService.get,
    },

    // ========== 表格配置 ==========
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
    permissions: {
      add: 'web-menu-template:create',
      edit: 'web-menu-template:update',
      remove: 'web-menu-template:delete',
    },
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'name',
        title: $t('template.web-menu.table.columns.name'),
        minWidth: 200,
        treeNode: true,
        align: 'left',
        slots: {
          default: ({ row }: any) => (
            <span>
              <Icon class="mr-1" icon={row.icon} />
              {row.name}
            </span>
          ),
        },
      },
      {
        field: 'code',
        title: $t('template.web-menu.table.columns.code'),
        minWidth: 150,
        align: 'left',
      },
      {
        field: 'url',
        title: $t('template.web-menu.table.columns.url'),
        minWidth: 150,
        align: 'left',
        formatter: ({ cellValue }: any) => cellValue || '-',
      },

      {
        field: 'category',
        title: $t('template.web-menu.table.columns.category'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.WEB_MENU_CATEGORY },
        },
      },
      {
        field: 'type',
        title: $t('template.web-menu.table.columns.type'),
        minWidth: 80,
        formatter: ({ cellValue }: any) => {
          const map: Record<number, string> = {
            1: $t('template.web-menu.form.modal.type_options.directory'),
            2: $t('template.web-menu.form.modal.type_options.menu'),
          };
          return map[cellValue] || '-';
        },
      },
      {
        field: 'sort',
        title: $t('template.web-menu.table.columns.sort'),
        minWidth: 80,
      },
      {
        field: 'is_show',
        title: $t('template.web-menu.table.columns.is_show'),
        minWidth: 80,
        cellRender: {
          name: 'CellDictTag',
          attrs: { code: DictEnum.SYS_YES_NO },
        },
      },
      {
        field: 'enabled',
        title: $t('template.web-menu.table.columns.enabled'),
        minWidth: 100,
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
          component: 'Input',
          fieldName: 'LIKE_name',
          label: $t('template.web-menu.table.search.name'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.web-menu.table.search.placeholder.name'),
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: $t('template.web-menu.table.search.code'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.web-menu.table.search.placeholder.code'),
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_category',
          label: $t('template.web-menu.table.search.category'),
          componentProps: {
            code: DictEnum.WEB_MENU_CATEGORY,
            clearable: true,
            placeholder: $t(
              'template.web-menu.table.search.placeholder.category',
            ),
          },
        },
        {
          component: 'Select',
          fieldName: 'EQ_type',
          label: $t('template.web-menu.table.search.type'),
          componentProps: {
            clearable: true,
            placeholder: $t('template.web-menu.table.search.placeholder.type'),
            options: [
              {
                label: $t(
                  'template.web-menu.form.modal.type_options.directory',
                ),
                value: 1,
              },
              {
                label: $t('template.web-menu.form.modal.type_options.menu'),
                value: 2,
              },
            ],
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: $t('template.web-menu.table.search.enabled'),
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            clearable: true,
            placeholder: $t(
              'template.web-menu.table.search.placeholder.enabled',
            ),
          },
        },
      ],
    },

    formDialog: {
      enabled: true,
      title: $t('template.web-menu.title'),
      width: 'w-[60%]',
      dialogType: 'drawer',
      wrapperClass: 'grid-cols-2',
      commonConfig: {
        labelWidth: 80,
        labelAlign: 'right',
      },
      schema: [
        {
          fieldName: 'id',
          label: $t('template.web-menu.form.modal.id'),
          component: 'Input',
          dependencies: { triggerFields: ['id'], show: false },
        },
        {
          fieldName: 'category',
          label: $t('template.web-menu.form.modal.category'),
          component: 'ApiDict',
          defaultValue: 1,
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            renderType: 'RadioGroup',
            code: DictEnum.WEB_MENU_CATEGORY,
            isBtn: true,
          },
        },
        {
          fieldName: 'app',
          label: $t('template.web-menu.form.modal.app'),
          component: 'ApiSelect',
          defaultValue: 'web',
          formItemClass: 'col-span-2',
          componentProps: {
            api: '/system/menu/app/list',
            requestMethod: 'GET',
          },
        },
        {
          fieldName: 'source',
          label: $t('template.web-menu.form.modal.source'),
          component: 'Input',
          defaultValue: 'template',
          formItemClass: 'col-span-2',
          dependencies: { triggerFields: ['id'], disabled: true },
        },
        {
          fieldName: 'name',
          label: $t('template.web-menu.form.modal.name'),
          component: 'Input',
          rules: 'required',
          formItemClass: 'col-span-2',
        },
        {
          fieldName: 'type',
          label: $t('template.web-menu.form.modal.type'),
          component: 'RadioGroup',
          defaultValue: 1,
          rules: 'required',
          formItemClass: 'col-span-2',
          componentProps: {
            isBtn: true,
            options: [
              {
                label: $t(
                  'template.web-menu.form.modal.type_options.directory',
                ),
                value: 1,
              },
              {
                label: $t('template.web-menu.form.modal.type_options.menu'),
                value: 2,
              },
            ],
          },
        },
        {
          fieldName: 'pid',
          label: $t('template.web-menu.form.modal.pid'),
          component: 'ApiTreeSelect',
          formItemClass: 'col-span-2',
          componentProps: (v: any) => ({
            placeholder: $t('template.web-menu.form.modal.placeholder.pid'),
            clearable: true,
            checkStrictly: true,
            api: '/template/web-menu/tree',
            requestMethod: 'get',
            params: {
              app: v.app || 'web',
              category: v.category || 1,
            },
            labelField: 'name',
            valueField: 'id',
          }),
        },
        {
          fieldName: 'url',
          label: $t('template.web-menu.form.modal.url'),
          component: 'Input',
          formItemClass: 'col-span-2',
          componentProps: (v: any) => ({
            placeholder: $t('template.web-menu.form.modal.placeholder.url'),
            clearable: true,
            disabled: v.type !== 2,
          }),
        },
        {
          fieldName: 'target',
          label: $t('template.web-menu.form.modal.target'),
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: (v: any) => ({
            code: DictEnum.WEB_MENU_TARGET,
            disabled: v.type !== 2,
          }),
        },
        {
          fieldName: 'icon',
          label: $t('template.web-menu.form.modal.icon'),
          component: 'IconPicker',
          formItemClass: 'col-span-1',
        },
        {
          fieldName: 'sort',
          label: $t('template.web-menu.form.modal.sort'),
          component: 'InputNumber',
          defaultValue: 999,
          formItemClass: 'col-span-1',
          componentProps: { min: -1 },
        },
        {
          fieldName: 'enabled',
          label: $t('template.web-menu.form.modal.enabled'),
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: {
            code: DictEnum.SYS_ENABLED_STATUS,
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
        {
          fieldName: 'is_show',
          label: $t('template.web-menu.form.modal.is_show'),
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: {
            code: DictEnum.SYS_YES_NO,
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
      ],
    },
  };
};
