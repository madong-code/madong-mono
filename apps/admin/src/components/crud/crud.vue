<template>
  <div class="bg-card h-full flex flex-col">
    <VxeGrid
      :grid-options="gridOptions"
      :form-options="formOptions"
      v-bind="$attrs"
    >
      <template #toolbar-actions>
        <slot name="toolbar-actions" :actions="toolbarActions">
          <TableAction
            :actions="toolbarActions"
            :drop-down-actions="[]"
          />
        </slot>
      </template>
      <template #toolbar-tools>
        <slot name="toolbar-tools" :actions="dropDownToolbarActions">
          <TableAction
            :actions="toolbarToolActions"
            :drop-down-actions="dropDownToolbarActions"
          />
        </slot>
      </template>
      <template v-for="(_, name) in filteredSlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </VxeGrid>
  </div>
  <DialogForm
    ref="dialogFormRef"
    :crud-schema="crudSchema"
    :crud-api="crudApi"
  />
</template>

<script setup lang="tsx">
import type { CrudApiInstance, CrudReadonlyState, CrudSchema } from './types'

import { useVbenVxeGrid } from '#/adapter/vxe-table'
import { computed, reactive, ref, useSlots } from 'vue'
import { ElMessage } from 'element-plus'
import { TableAction } from '#/components/table-action'
import DialogForm from './dialog-form.vue'
import { useAction } from './use-action'
import { useColumns } from './use-columns'

const EXCLUDED_SLOTS = ['toolbar-actions', 'toolbar-tools']

const props = defineProps<{
  crudSchema: CrudSchema
  crudApi: CrudApiInstance
}>()

const emit = defineEmits<{
  register: [instance: any]
}>()

const slots = useSlots()

const dialogFormRef = ref<any>(null)
const readonlyState = reactive<CrudReadonlyState>({ selection: [] })

const { toolbarActions, dropDownToolbarActions, toolbarToolActions, tableActions, dropDownActions } =
  useAction(props.crudSchema, dialogFormRef, props.crudApi)

const columns = useColumns(props.crudSchema, tableActions, dropDownActions)

const filteredSlots = computed(() => {
  const result: Record<string, any> = {}
  for (const name of Object.keys(slots)) {
    if (!EXCLUDED_SLOTS.includes(name)) {
      result[name] = slots[name]
    }
  }
  return result
})

const formOptions = computed(() => {
  if (props.crudSchema.useSearchForm === false) return undefined
  const schema =
    typeof props.crudSchema.searchFormSchema === 'function'
      ? props.crudSchema.searchFormSchema()
      : props.crudSchema.searchFormSchema
  return schema ? { schema } : undefined
})

const gridOptions = computed(() => {
  const { crudApi: api, paginationConfig, tree, toolbarConfig } = props.crudSchema
  const hasSearchForm = props.crudSchema.useSearchForm !== false && !!formOptions.value

  return {
    columns: columns.value,
    height: 'auto',
    keepSource: true,
    pagerConfig: tree ? { enabled: false } : undefined,
    treeConfig: tree
      ? {
          parentField: tree.pid || 'parentId',
          rowField: tree.id || 'id',
          transform: false,
        }
      : undefined,
    toolbarConfig: {
      refresh: toolbarConfig?.refresh ?? true,
      custom: toolbarConfig?.custom ?? true,
      zoom: toolbarConfig?.zoom ?? true,
      export: toolbarConfig?.export ?? false,
      search: hasSearchForm,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }: any, formValues: any) => {
          const params = {
            [paginationConfig?.currentKey || 'pageNum']: page.currentPage,
            [paginationConfig?.sizeKey || 'pageSize']: page.pageSize,
            ...formValues,
          }
          const processedParams = props.crudSchema.beforeFetch
            ? props.crudSchema.beforeFetch(params)
            : params
          let result = await api.list(processedParams)
          if (props.crudSchema.afterFetch) {
            result = props.crudSchema.afterFetch(result)
          }
          return result
        },
      },
    },
  }
})

const [VxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: gridOptions.value,
  formOptions: formOptions.value,
})

function handleDelete(row: any) {
  const rowKey = props.crudSchema.rowKey || 'id'
  const ids = row?.[rowKey]
    ? [row[rowKey]]
    : readonlyState.selection.map((item: any) => item[rowKey])

  props.crudSchema.crudApi.remove?.({ [`${rowKey}s`]: ids }).then(() => {
    ElMessage.success(`删除${props.crudSchema.dialogTitle || ''}成功`)
    crudInstance.refreshRemove()
  })
}

const crudInstance: CrudApiInstance = {
  query: (params?: any) => gridApi.query(params),
  reload: (params?: any) => gridApi.reload(params),
  setLoading: (loading: boolean) => gridApi.setLoading(loading),
  getGridInstance: () => gridApi.grid,
  getFormApi: () => gridApi.formApi,
  getRowSelection: () => readonlyState.selection,
  getReadonlyState: () => readonlyState,

  refreshData: () => gridApi.reload(),
  refreshSoft: () => gridApi.query(),
  refreshCreate: () => gridApi.reload(),
  refreshUpdate: () => gridApi.query(),
  refreshRemove() {
    const grid = gridApi.grid
    if (!grid) return
    const fullData = grid.getTableData()?.fullData
    if (
      fullData?.length === 1 ||
      fullData?.length === readonlyState.selection.length
    ) {
      const proxyInfo = grid.getProxyInfo()
      if (proxyInfo?.pager && proxyInfo.pager.currentPage > 1) {
        proxyInfo.pager.currentPage -= 1
      }
    }
    gridApi.query()
  },

  openAddDialog() {
    dialogFormRef.value?.show({ data: {}, type: 'add' })
  },
  openEditDialog(row: any) {
    dialogFormRef.value?.show({ data: row, type: 'edit' })
  },
  openViewDialog(row: any) {
    dialogFormRef.value?.show({ data: row, type: 'view' })
  },

  removeByApi(row: any) {
    handleDelete(row)
  },
  executeRemove(row: any) {
    handleDelete(row)
  },
  executeBatchRemove() {
    handleDelete({})
  },

  setState(_state: Partial<CrudSchema>) {
    return Promise.resolve()
  },
  getState() {
    return props.crudSchema
  },
}

emit('register', crudInstance)
defineExpose(crudInstance)
</script>
