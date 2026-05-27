import type { CrudSchema } from '#/components/crud/components/types'

import { PlatformMenuService } from '#/api/system/platform-menu'

function arrayToTree(data: any[], idKey = 'id', pidKey = 'pid', childrenKey = 'children'): any[] {
  const map = new Map<any, any>()
  const roots: any[] = []

  data.forEach((item) => {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  })

  data.forEach((item) => {
    const node = map.get(item[idKey])
    if (item[pidKey] === null || item[pidKey] === undefined || item[pidKey] === 0) {
      roots.push(node)
    } else {
      const parent = map.get(item[pidKey])
      if (parent) {
        parent[childrenKey].push(node)
      } else {
        roots.push(node)
      }
    }
  })

  return roots
}

export const useCrudSchema = (): CrudSchema => {
  return {
    crudApi: {
      list: PlatformMenuService.list,
      add: PlatformMenuService.create,
      edit: PlatformMenuService.update,
      remove: PlatformMenuService.delete,
    },

    rowKey: 'id',
    hasAdd: true,
    hasEdit: true,
    hasView: false,
    hasRemove: true,
    hasBatchRemove: false,
    tree: { id: 'id', pid: 'pid', children: 'children' },
    beforeFetch: (params: any) => {
      return params
    },
    afterFetch: (res: any) => {
      const items = Array.isArray(res) ? res : res?.items || []
      return {
        items: arrayToTree(items),
        total: items.length,
      }
    },
    columns: [
      { field: 'id', title: 'ID', minWidth: 60, visible: false },
      { field: 'title', title: '菜单名称', minWidth: 200, treeNode: true, align: 'left' },
      { field: 'code', title: '权限标识', minWidth: 120 },
      {
        field: 'type',
        title: '类型',
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: 'sys_menu_type' },
      },
      { field: 'path', title: '路由地址', minWidth: 150 },
      { field: 'component', title: '组件路径', minWidth: 150 },
      { field: 'icon', title: '图标', minWidth: 80 },
      { field: 'sort', title: '排序', minWidth: 60 },
      {
        field: 'is_show',
        title: '是否显示',
        minWidth: 80,
        cellRender: { name: 'CellDictTag' },
        componentProps: { code: 'sys_yes_no' },
      },
      {
        field: 'enabled',
        title: '状态',
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: 'sys_enabled_status' },
      },
    ],

    searchForm: {
      enabled: true,
      collapsed: true,
      collapsedRows: 2,
      schema: [
        {
          component: 'ApiDict',
          fieldName: 'EQ_type',
          label: '菜单类型',
          componentProps: {
            code: 'sys_menu_type',
            clearable: true,
            placeholder: '请选择类型',
          },
        },
        {
          component: 'ApiDict',
          fieldName: 'EQ_enabled',
          label: '状态',
          componentProps: {
            code: 'sys_enabled_status',
            clearable: true,
            placeholder: '请选择状态',
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_title',
          label: '菜单名称',
          componentProps: {
            clearable: true,
            placeholder: '请输入菜单名称',
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_code',
          label: '权限标识',
          componentProps: {
            clearable: true,
            placeholder: '请输入权限标识',
          },
        },
        {
          component: 'Input',
          fieldName: 'LIKE_path',
          label: '路由地址',
          componentProps: {
            clearable: true,
            placeholder: '请输入路由地址',
          },
        },
      ],
    },

    formDialog: {
      enabled: true,
      width: 'w-[60%]',
      dialogType: 'drawer',
      wrapperClass: 'grid-cols-2',
      commonConfig: {
        labelWidth: 80,
        labelAlign: 'right',
      },
      schema: [
        {
          label: 'ID',
          fieldName: 'id',
          component: 'Input',
          formItemClass: 'col-span-2',
          dependencies: {
            triggerFields: ['id'],
            show: false,
          },
        },
        {
          label: '菜单类型',
          fieldName: 'type',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-2',
          rules: 'required',
          componentProps: {
            placeholder: '请选择类型',
            code: 'sys_menu_type',
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
        {
          label: '上级菜单',
          fieldName: 'pid',
          component: 'ApiTreeSelect',
          formItemClass: 'col-span-1',
          componentProps: {
            placeholder: '请选择上级菜单',
            clearable: true,
            checkStrictly: true,
            api: '/platform-menu/tree',
            requestMethod: 'get',
            labelField: 'title',
            valueField: 'id',
          },
        },
        {
          label: '菜单名称',
          fieldName: 'title',
          component: 'Input',
          formItemClass: 'col-span-1',
          rules: 'required',
          componentProps: {
            placeholder: '请输入菜单名称',
            clearable: true,
          },
        },
        {
          label: '权限标识',
          fieldName: 'code',
          component: 'Input',
          formItemClass: 'col-span-1',
          rules: 'required',
          componentProps: {
            placeholder: '请输入权限标识',
            clearable: true,
          },
        },
        {
          label: '路由地址',
          fieldName: 'path',
          component: 'Input',
          formItemClass: 'col-span-1',
          componentProps: (values: any) => {
            return {
              placeholder: '请输入路由地址',
              clearable: true,
              disabled: ![1, 2, 4].includes(values.type),
            }
          },
        },
        {
          label: '组件路径',
          fieldName: 'component',
          component: 'Input',
          formItemClass: 'col-span-1',
          componentProps: (values: any) => {
            return {
              placeholder: '请输入组件路径',
              clearable: true,
              disabled: ![1, 2].includes(values.type),
            }
          },
        },
        {
          label: '打开方式',
          fieldName: 'open_type',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          rules: 'required',
          componentProps: (values: any) => {
            return {
              placeholder: '请选择打开方式',
              code: 'sys_menu_open_type',
              isBtn: true,
              renderType: 'RadioGroup',
              disabled: values.type !== 2,
            }
          },
        },
        {
          label: '图标',
          fieldName: 'icon',
          component: 'IconPicker',
          formItemClass: 'col-span-1',
          componentProps: (values: any) => {
            return {
              class: 'w-full',
              placeholder: '请选择图标',
              clearable: true,
              disabled: ![1, 2].includes(values.type),
            }
          },
        },
        {
          label: '外链地址',
          fieldName: 'link_url',
          component: 'Input',
          formItemClass: 'col-span-1',
          componentProps: (values: any) => {
            return {
              placeholder: '请输入外链地址',
              clearable: true,
              disabled: values.type !== 2,
            }
          },
        },
        {
          fieldName: 'sort',
          label: '排序',
          component: 'InputNumber',
          formItemClass: 'col-span-1',
          defaultValue: 999,
          componentProps: {
            placeholder: '请输入排序',
            clearable: true,
            min: 0,
          },
        },
        {
          label: '状态',
          fieldName: 'enabled',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: {
            placeholder: '请选择状态',
            code: 'yes_no',
            isBtn: true,
            renderType: 'RadioGroup',
          },
        },
        {
          label: '是否显示',
          fieldName: 'is_show',
          component: 'ApiDict',
          defaultValue: 1,
          formItemClass: 'col-span-1',
          componentProps: (values: any) => {
            return {
              placeholder: '请选择',
              code: 'yes_no',
              isBtn: true,
              renderType: 'RadioGroup',
              disabled: ![1, 2].includes(values.type),
            }
          },
        },
      ],
    },
  }
}
