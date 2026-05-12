<template>
  <Modal v-if="crudSchema.dialogType !== 'drawer'" :title="dialogTitle" :class="dialogWidth" draggable>
    <DetailView v-if="viewType === 'view'" class="p-4" :model="currentRow" :schema="formSchema" />
    <BasicForm v-else class="p-4" :show-default-actions="false" />
  </Modal>
  <Drawer v-else :title="dialogTitle" :class="dialogWidth">
    <DetailView v-if="viewType === 'view'" class="p-4" :model="currentRow" :schema="formSchema" />
    <BasicForm v-else class="p-4" :show-default-actions="false" />
  </Drawer>
</template>

<script setup lang="ts">
import type { CrudApiInstance, CrudSchema } from './types'

import { useVbenForm } from '#/adapter/form'
import { useVbenModal, useVbenDrawer } from '@vben/common-ui'
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DetailView } from '#/components/reader'

const props = defineProps<{
  crudSchema: CrudSchema
  crudApi: CrudApiInstance
}>()

const viewType = ref<'add' | 'edit' | 'view'>('view')
const updateFlag = ref(false)
const currentRow = ref<any>({})

const formSchema = computed(() => {
  const schema =
    typeof props.crudSchema.formSchema === 'function'
      ? props.crudSchema.formSchema()
      : props.crudSchema.formSchema
  return schema || []
})

const [BasicForm, formApi] = useVbenForm({ 
  schema: formSchema.value,
  showDefaultActions: false,
})

const dialogTitle = computed(() => {
  const title = props.crudSchema.dialogTitle || ''
  if (viewType.value === 'add')
    return `${props.crudSchema.addButtonText || '新增'}${title}`
  if (viewType.value === 'edit')
    return `${props.crudSchema.editButtonText || '编辑'}${title}`
  return `${props.crudSchema.viewButtonText || '详情'}${title}`
})

const dialogWidth = computed(() => props.crudSchema.dialogWidth || 'w-[60%]')

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    await handleSubmit()
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) handleOpen()
  },
})

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    await handleSubmit()
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) handleOpen()
  },
})

const currentApi = computed(() =>
  props.crudSchema.dialogType === 'drawer' ? drawerApi : modalApi,
)

function handleOpen() {
  const data = currentApi.value.getData<any>()
  if (data) currentRow.value = data

  if (viewType.value === 'view') {
    currentApi.value.setState({ footer: false, closeOnClickModal: true })
  } else {
    currentApi.value.setState({ footer: true, closeOnClickModal: false })
  }

  if (viewType.value === 'edit' || viewType.value === 'view') {
    const rowKey = props.crudSchema.rowKey || 'id'
    props.crudSchema.crudApi.view?.(currentRow.value[rowKey]).then((res) => {
      currentRow.value = { ...currentRow.value, ...res }
      nextTick(() => {
        formApi.setValues(currentRow.value)
      })
    })
  } else {
    if (props.crudSchema.tree) {
      const pidKey = props.crudSchema.tree.pid || 'parentId'
      const idKey = props.crudSchema.tree.id || 'id'
      currentRow.value = { [pidKey]: currentRow.value[idKey] }
    }
    nextTick(() => {
      formApi.setValues(currentRow.value)
    })
  }
}

async function handleSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return

  currentApi.value.lock()
  try {
    const values = await formApi.getValues()
    let submitValues = values
    if (props.crudSchema.transformFormValues) {
      submitValues = props.crudSchema.transformFormValues(
        values,
        updateFlag.value ? 'edit' : 'add',
      )
    }
    const submitApi = updateFlag.value
      ? props.crudSchema.crudApi.edit
      : props.crudSchema.crudApi.add
    await submitApi?.(submitValues)
    ElMessage.success(updateFlag.value ? '编辑成功' : '新增成功')
    currentApi.value.close()
    if (updateFlag.value) {
      props.crudApi.refreshUpdate()
    } else {
      props.crudApi.refreshCreate()
    }
  } finally {
    currentApi.value.unlock()
  }
}

function show({
  data,
  type = 'view',
}: {
  data: any
  type: 'add' | 'edit' | 'view'
}) {
  viewType.value = type
  updateFlag.value = type === 'edit'
  currentRow.value = data || {}
  currentApi.value.setData(data).open()
}

defineExpose({ show })
</script>

<style lang="scss" scoped>
:deep(.vben-form) {
  max-height: none !important;
  overflow: visible !important;
}

:deep(.vben-form > form) {
  max-height: none !important;
  overflow: visible !important;
}

:deep(.vben-form > form > div) {
  max-height: none !important;
  overflow: visible !important;
}

:deep(.el-form) {
  max-height: none !important;
  overflow: visible !important;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.detail-view) {
  max-height: none !important;
  overflow: visible !important;
}
</style>
