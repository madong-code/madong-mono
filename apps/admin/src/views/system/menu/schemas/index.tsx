import type { CrudSchema } from '#/components/crud/components/types'

import { MenuService } from '#/api/system'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'

/**
 * 将扁平数组转换为树形结构
 */
function arrayToTree(data: any[], idKey = 'id', pidKey = 'pid', childrenKey = 'children'): any[] {
  const map = new Map<any, any>()
  const roots: any[] = []

  // 建立 id 到节点的映射
  data.forEach((item) => {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  })

  // 构建树形结构
  data.forEach((item) => {
    const node = map.get(item[idKey])
    if (item[pidKey] === null || item[pidKey] === undefined || item[pidKey] === 0) {
      roots.push(node)
    } else {
      const parent = map.get(item[pidKey])
      if (parent) {
        parent[childrenKey].push(node)
      } else {
        // 找不到父节点，作为根节点
        roots.push(node)
      }
    }
  })

  return roots
}

export const crudSchema: CrudSchema = {
  crudApi: {
    list: MenuService.list,
    add: MenuService.create,
    edit: MenuService.update,
    remove: MenuService.remove,
    view: MenuService.get,
  },

  // 表格配置
  table: {
    rowKey: 'id',
    hasAdd: true,
    hasEdit: true,
    hasView: false,
    hasRemove: true,
    hasBatchRemove: false,
    permissions: {
      add: 'system:menu:create',
      edit: 'system:menu:update',
      remove: 'system:menu:delete',
      view: 'system:menu:read',
    },
    tree: { id: 'id', pid: 'pid', children: 'children' },
    // 请求前处理：树形不分页，设置 page=1 limit=999 一次加载全部
    beforeFetch: (params: any) => {
      return { ...params, page: 1, limit: 999 }
    },
    // 处理返回数据：扁平数组转树形
    afterFetch: (res: { items?: any[]; total?: number }) => {
      const items = res?.items || []
      return {
        items: arrayToTree(items),
        total: res?.total ?? items.length,
      }
    },
    columns: [
      { field: 'id', title: $t('system.menu.table.columns.id'), minWidth: 60, visible: false },
      { field: 'title', title: $t('system.menu.table.columns.title'), minWidth: 200, treeNode: true, align: 'left' },
      { field: 'code', title: $t('system.menu.table.columns.code'), minWidth: 120 },
      {
        field: 'type',
        title: $t('system.menu.table.columns.type'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_MENU_TYPE },
      },
      { field: 'path', title: $t('system.menu.table.columns.path'), minWidth: 150 },
      { field: 'component', title: $t('system.menu.table.columns.component'), minWidth: 150 },
      { field: 'icon', title: $t('system.menu.table.columns.icon'), minWidth: 80 },
      { field: 'sort', title: $t('system.menu.table.columns.sort'), minWidth: 60 },
      {
        field: 'is_show',
        title: $t('system.menu.table.columns.is_show'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_YES_NO },
      },
      {
        field: 'enabled',
        title: $t('system.menu.table.columns.enabled'),
        minWidth: 80,
        viewComponent: 'ApiDict',
        viewComponentProps: { code: DictEnum.SYS_ENABLED_STATUS },
      },
    ],
  },

  // 搜索表单配置
  searchForm: {
    enabled: true,
    schema: [
      {
        fieldName: 'LIKE_title',
        label: $t('system.menu.search.title'),
        component: 'Input',
      },
    ],
  },

  // 表单弹窗配置
  formDialog: {
    enabled: true,
    schema: [
      { fieldName: 'id', label: $t('system.menu.form.id'), component: 'Input', dependencies: { triggerFields: [], show: false } },
      { fieldName: 'pid', label: $t('system.menu.form.pid'), component: 'TreeSelect', componentProps: { code: 'menu', clearable: true } },
      { fieldName: 'title', label: $t('system.menu.form.title'), component: 'Input', rules: 'required' },
      { fieldName: 'code', label: $t('system.menu.form.code'), component: 'Input', rules: 'required' },
      {
        fieldName: 'type',
        label: $t('system.menu.form.type'),
        component: 'ApiDict',
        rules: 'required',
        componentProps: { code: DictEnum.SYS_MENU_TYPE, clearable: true },
      },
      { fieldName: 'path', label: $t('system.menu.form.path'), component: 'Input' },
      { fieldName: 'component', label: $t('system.menu.form.component'), component: 'Input' },
      { fieldName: 'icon', label: $t('system.menu.form.icon'), component: 'IconPicker' },
      { fieldName: 'sort', label: $t('system.menu.form.sort'), component: 'InputNumber', defaultValue: 0, componentProps: { min: 0, precision: 0 } },
      {
        fieldName: 'is_show',
        label: $t('system.menu.form.is_show'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_YES_NO, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'enabled',
        label: $t('system.menu.form.enabled'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_ENABLED_STATUS, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 1,
      },
      {
        fieldName: 'is_cache',
        label: $t('system.menu.form.is_cache'),
        component: 'ApiDict',
        componentProps: { code: DictEnum.SYS_YES_NO, renderType: 'RadioGroup', isBtn: true },
        defaultValue: 0,
      },
    ],
    title: $t('system.menu.title'),
    width: 'w-[50%]',
  },
}
