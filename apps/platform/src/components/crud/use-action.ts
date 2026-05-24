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

import type { CrudSchema } from './components/types'
import type { ActionItem } from './components/table-action'

import { computed } from 'vue'

// useAction 所需的最小 API 接口
interface UseActionApi {
  executeBatchRemove: () => void
  executeRemove: (row: any) => void
}

export function useAction(
  crudSchema: CrudSchema,
  dialogFormRef: Ref<any>,
  crudApi: UseActionApi,
  getSelection?: () => any[],
) {
  // 获取表单弹窗配置
  const formDialogEnabled = computed(() => {
    return crudSchema.formDialog?.enabled !== false
  })

  // 表格配置
  const tableConfig = computed(() => {
    return {
      hasAdd: crudSchema.hasAdd ?? true,
      hasBatchRemove: crudSchema.hasBatchRemove ?? true,
      hasEdit: crudSchema.hasEdit ?? true,
      hasView: crudSchema.hasView ?? false,
      hasRemove: crudSchema.hasRemove ?? true,
      tree: crudSchema.tree,
    }
  })

  // 计算下拉菜单中已有的自定义操作数量
  const dropDownToolbarActionsCount = computed(() => {
    return crudSchema.dropDownToolbarActions?.length || 0
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
        label: crudSchema.buttonText?.add || '新增',
        type: 'primary',
        icon: 'ant-design:plus-outlined',
        auth: crudSchema.permissions?.add,
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
          auth: crudSchema.permissions?.remove,
          ifShow: () => hasSelection.value,
          onClick: () => {
            crudApi.executeBatchRemove()
          },
        })
      }
    }

    actions.push(...(crudSchema.toolbarActions || []))
    return actions
  })

  const toolbarToolActions = computed(() => {
    const actions: ActionItem[] = []
    const tc = crudSchema.toolbar

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
          auth: crudSchema.permissions?.remove,
          ifShow: () => hasSelection.value,
          onClick: () => {
            crudApi.executeBatchRemove()
          },
        })
      }
    }

    actions.push(...(crudSchema.dropDownToolbarActions || []))
    return actions
  })

  const tableActions = computed(() => {
    const actions: ActionItem[] = []

    if (crudSchema.formDialog?.enabled !== false) {
      if (tableConfig.value.hasView) {
        actions.push({
          label: crudSchema.buttonText?.view || '详情',
          type: 'primary',
          link: true,
          icon: 'ant-design:eye-outlined',
          auth: crudSchema.permissions?.view,
          dialogRef: dialogFormRef,
          dialogParams() {
            return { type: 'view' }
          },
        })
      }

      if (tableConfig.value.hasEdit) {
        actions.push({
          label: crudSchema.buttonText?.edit || '编辑',
          type: 'primary',
          link: true,
          icon: 'ant-design:edit-outlined',
          auth: crudSchema.permissions?.edit,
          dialogRef: dialogFormRef,
          dialogParams: {
            type: 'edit',
          },
        })
      }
    }

    actions.push(...(crudSchema.tableActions || []))
    return actions
  })

  const dropDownActions = computed(() => {
    const actions: ActionItem[] = []

    if (crudSchema.formDialog?.enabled !== false) {
      // 新增子节点（树形）
      if (tableConfig.value.hasAdd && tableConfig.value.tree) {
        actions.push({
          label: (crudSchema.buttonText?.add || '新增') + '子节点',
          icon: 'ant-design:plus-outlined',
          size: 'small',
          auth: crudSchema.permissions?.add,
          dialogRef: dialogFormRef,
          dialogParams: {
            type: 'add',
            tree: tableConfig.value.tree,
          },
        })
      }

      if (tableConfig.value.hasRemove) {
        actions.push({
          label: crudSchema.buttonText?.remove || '删除',
          type: 'danger',
          icon: 'ant-design:delete-outlined',
          size: 'small',
          auth: crudSchema.permissions?.remove,
          onClick: (_action: any, _record: any) => {
            crudApi.executeRemove(_record)
          },
        })
      }
    }

    actions.push(...(crudSchema.dropDownActions || []))
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
