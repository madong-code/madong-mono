import type { Ref } from 'vue'

import type { ActionItem } from './types'
import type { CrudApiInstance, CrudSchema } from './types'

import { computed } from 'vue'

export function useAction(
  crudSchema: CrudSchema,
  dialogFormRef: Ref<any>,
  crudApi: CrudApiInstance,
) {
  const toolbarActions = computed(() => {
    const actions: ActionItem[] = []
    if (crudSchema.useCrud === true && crudSchema.hasAdd !== false) {
      actions.push({
        label: crudSchema.addButtonText || '新增',
        type: 'primary',
        icon: 'ant-design:plus-outlined',
        auth: crudSchema.addAuth,
        dialogRef: dialogFormRef,
        dialogParams: {
          type: 'add',
        },
      })
    }
    actions.push(...(crudSchema.toolbarActions || []))
    return actions
  })

  const toolbarToolActions = computed(() => {
    const actions: ActionItem[] = []
    if (crudSchema.toolbarConfig?.export) {
      actions.push({
        label: '导出',
        icon: 'ant-design:download-outlined',
        type: 'primary',
        link: true,
        onClick: () => {
          const grid = crudApi.getGridInstance()
          grid?.exportData?.()
        },
      })
    }
    if (crudSchema.toolbarConfig?.print) {
      actions.push({
        label: '打印',
        icon: 'ant-design:printer-outlined',
        type: 'primary',
        link: true,
        onClick: () => {
          const grid = crudApi.getGridInstance()
          grid?.print?.()
        },
      })
    }
    actions.push(...(crudSchema.toolbarConfig?.tools || []))
    return actions
  })

  const dropDownToolbarActions = computed(() => {
    const actions: ActionItem[] = []
    if (crudSchema.useCrud === true && crudSchema.hasRemove !== false) {
      actions.push({
        label: '批量删除',
        type: 'danger',
        icon: 'ant-design:delete-outlined',
        auth: crudSchema.removeAuth,
        ifShow: () => crudApi.getReadonlyState().selection.length > 0,
        confirm: {
          title: '提示',
          content: '确定批量删除吗？',
          ok() {
            crudApi.executeBatchRemove()
          },
        },
      })
    }
    actions.push(...(crudSchema.dropDownToolbarActions || []))
    return actions
  })

  const tableActions = computed(() => {
    const actions: ActionItem[] = []
    if (crudSchema.useCrud === true && crudSchema.hasView !== false) {
      actions.push({
        label: crudSchema.viewButtonText || '详情',
        type: 'primary',
        link: true,
        icon: 'ant-design:eye-outlined',
        auth: crudSchema.viewAuth,
        dialogRef: dialogFormRef,
        dialogParams() {
          return { type: 'view' }
        },
      })
    }
    if (crudSchema.useCrud === true && crudSchema.hasEdit !== false) {
      actions.push({
        label: crudSchema.editButtonText || '编辑',
        type: 'primary',
        link: true,
        icon: 'ant-design:edit-outlined',
        auth: crudSchema.editAuth,
        dialogRef: dialogFormRef,
        dialogParams: {
          type: 'edit',
        },
      })
    }
    actions.push(...(crudSchema.tableActions || []))
    return actions
  })

  const dropDownActions = computed(() => {
    const actions: ActionItem[] = []
    if (crudSchema.useCrud === true && crudSchema.hasAdd !== false) {
      if (crudSchema.tree) {
        actions.push({
          label: (crudSchema.addButtonText || '新增') + '子节点',
          icon: 'ant-design:plus-outlined',
          size: 'small',
          auth: crudSchema.addAuth,
          dialogRef: dialogFormRef,
          dialogParams: {
            type: 'add',
            tree: crudSchema.tree,
          },
        })
      }
    }
    if (crudSchema.useCrud === true && crudSchema.hasRemove !== false) {
      actions.push({
        label: crudSchema.removeButtonText || '删除',
        type: 'danger',
        icon: 'ant-design:delete-outlined',
        size: 'small',
        auth: crudSchema.removeAuth,
        confirm: {
          title: '提示',
          content: '确定删除吗？',
          ok(record: any) {
            crudApi.removeByApi(record)
          },
        },
      })
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
