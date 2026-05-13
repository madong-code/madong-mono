/**
 * CRUD 操作按钮生成逻辑
 *
 * 配置位置说明：
 * - table：统一的表格配置
 *   - table.hasAdd：控制新增按钮
 *   - table.hasBatchRemove：控制批量删除按钮
 *   - table.hasEdit/hasView/hasRemove：控制表格行操作按钮
 *   - table.tree：控制树形结构和新增子节点按钮
 *   - table.pagination：控制分页配置
 *   - table.toolbar：控制工具栏配置
 * - formDialog：控制表单弹窗相关配置
 */

import type { Ref } from 'vue'

import type { CrudApiInstance, CrudSchema } from './components/types'
import type { ActionItem } from '#/components/table-action'

import { computed } from 'vue'

export function useAction(
  crudSchema: CrudSchema,
  dialogFormRef: Ref<any>,
  crudApi: CrudApiInstance,
  getSelection?: () => any[],
) {
  // 获取表单弹窗配置
  const formDialogEnabled = computed(() => {
    return crudSchema.formDialog?.enabled !== false
  })

  // 表格配置
  const tableConfig = computed(() => {
    return {
      // 新增按钮
      hasAdd: crudSchema.table?.hasAdd ?? true,
      // 批量删除按钮
      hasBatchRemove: crudSchema.table?.hasBatchRemove ?? true,
      // 行操作按钮
      hasEdit: crudSchema.table?.hasEdit ?? true,
      hasView: crudSchema.table?.hasView ?? false,
      hasRemove: crudSchema.table?.hasRemove ?? true,
      // 树形配置
      tree: crudSchema.table?.tree,
    }
  })

  // 计算下拉菜单中已有的自定义操作数量
  const dropDownToolbarActionsCount = computed(() => {
    return crudSchema.table?.dropDownToolbarActions?.length || 0
  })

  // 是否应将批量删除放到下拉菜单中（当下拉菜单已有自定义操作时）
  const shouldRemoveInDropdown = computed(() => {
    return dropDownToolbarActionsCount.value > 0
  })

  // 是否有选中的数据
  const hasSelection = computed(() => {
    const selection = getSelection ? getSelection() : []
    return selection.length > 0
  })

  // toolbarActions：主工具栏按钮（新增、批量删除等）
  const toolbarActions = computed(() => {
    const actions: ActionItem[] = []

    if (tableConfig.value.hasAdd && formDialogEnabled.value) {
      actions.push({
        label: crudSchema.table?.buttonText?.add || '新增',
        type: 'primary',
        icon: 'ant-design:plus-outlined',
        auth: crudSchema.table?.permissions?.add,
        dialogRef: dialogFormRef,
        dialogParams: {
          type: 'add',
        },
      })
    }

    if (tableConfig.value.hasBatchRemove && formDialogEnabled.value) {
      // 规则：当下拉菜单已有自定义操作时，批量删除也放到下拉菜单中
      if (!shouldRemoveInDropdown.value) {
        actions.push({
          label: '批量删除',
          type: 'danger',
          icon: 'ant-design:delete-outlined',
          auth: crudSchema.table?.permissions?.remove,
          ifShow: () => hasSelection.value,
          onClick: () => {
            crudApi.executeBatchRemove()
          },
        })
      }
    }

    actions.push(...(crudSchema.table?.toolbarActions || []))
    return actions
  })

  const toolbarToolActions = computed(() => {
    const actions: ActionItem[] = []
    const tc = crudSchema.table?.toolbar

    if (tc?.export) {
      actions.push({
        label: '导出',
        icon: 'ant-design:download-outlined',
        type: 'primary',
        link: true,
        onClick: () => {},
      })
    }

    if (tc?.print) {
      actions.push({
        label: '打印',
        icon: 'ant-design:printer-outlined',
        type: 'primary',
        link: true,
        onClick: () => {},
      })
    }

    actions.push(...(tc?.tools || []))
    return actions
  })

  // toolbarTools 下拉菜单中的操作按钮
  const dropDownToolbarActions = computed(() => {
    const actions: ActionItem[] = []

    if (tableConfig.value.hasBatchRemove && formDialogEnabled.value) {
      // 规则：当下拉菜单已有自定义操作时，批量删除也放到下拉菜单中
      if (shouldRemoveInDropdown.value) {
        actions.push({
          label: '批量删除',
          type: 'danger',
          icon: 'ant-design:delete-outlined',
          auth: crudSchema.table?.permissions?.remove,
          ifShow: () => hasSelection.value,
          onClick: () => {
            crudApi.executeBatchRemove()
          },
        })
      }
    }

    actions.push(...(crudSchema.table?.dropDownToolbarActions || []))
    return actions
  })

  const tableActions = computed(() => {
    const actions: ActionItem[] = []

    if (crudSchema.formDialog?.enabled !== false) {
      if (tableConfig.value.hasView) {
        actions.push({
          label: crudSchema.table?.buttonText?.view || '详情',
          type: 'primary',
          link: true,
          icon: 'ant-design:eye-outlined',
          auth: crudSchema.table?.permissions?.view,
          dialogRef: dialogFormRef,
          dialogParams() {
            return { type: 'view' }
          },
        })
      }

      if (tableConfig.value.hasEdit) {
        actions.push({
          label: crudSchema.table?.buttonText?.edit || '编辑',
          type: 'primary',
          link: true,
          icon: 'ant-design:edit-outlined',
          auth: crudSchema.table?.permissions?.edit,
          dialogRef: dialogFormRef,
          dialogParams: {
            type: 'edit',
          },
        })
      }
    }

    actions.push(...(crudSchema.table?.tableActions || []))
    return actions
  })

  const dropDownActions = computed(() => {
    const actions: ActionItem[] = []

    if (crudSchema.formDialog?.enabled !== false) {
      // 新增子节点（树形）
      if (tableConfig.value.hasAdd && tableConfig.value.tree) {
        actions.push({
          label: (crudSchema.table?.buttonText?.add || '新增') + '子节点',
          icon: 'ant-design:plus-outlined',
          size: 'small',
          auth: crudSchema.table?.permissions?.add,
          dialogRef: dialogFormRef,
          dialogParams: {
            type: 'add',
            tree: tableConfig.value.tree,
          },
        })
      }

      if (tableConfig.value.hasRemove) {
        actions.push({
          label: crudSchema.table?.buttonText?.remove || '删除',
          type: 'danger',
          icon: 'ant-design:delete-outlined',
          size: 'small',
          auth: crudSchema.table?.permissions?.remove,
          onClick: (_action: any, _record: any) => {
            crudApi.executeRemove(_record)
          },
        })
      }
    }

    actions.push(...(crudSchema.table?.dropDownActions || []))
    return actions
  })

  return {
    toolbarActions,
    toolbarToolActions,
    dropDownToolbarActions,
    tableActions,
    dropDownActions,
  }
}
