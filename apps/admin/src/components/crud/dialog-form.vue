<script setup lang="ts">
import type { CrudApiInstance, CrudSchema } from './types'
import type { FormActionType, FormDialogOptions } from '#/components/form-dialog'

import FormDialogComponent from '#/components/form-dialog/form-dialog.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  crudSchema: CrudSchema
  crudApi: CrudApiInstance
}>()

const dialogRef = ref<any>(null)

// 将 CrudSchema 转换为 FormDialogOptions（computed 保持响应式）
const formDialogOptions = computed<FormDialogOptions>(() => ({
  schema: props.crudSchema.formSchema,
  api: {
    add: props.crudSchema.crudApi.add,
    edit: props.crudSchema.crudApi.edit,
    view: props.crudSchema.crudApi.view,
  },
  dialogType: props.crudSchema.dialogType || 'modal',
  title: props.crudSchema.dialogTitle || '',
  width: props.crudSchema.dialogWidth || 'w-[60%]',
  rowKey: props.crudSchema.rowKey || 'id',
  transformFormValues: props.crudSchema.transformFormValues,
  onSuccess(type: FormActionType) {
    if (type === 'edit') {
      props.crudApi.refreshUpdate()
    } else {
      props.crudApi.refreshCreate()
    }
  },
}))

// 暴露 show 方法，兼容 crud.vue 的调用方式
function show({ data, type }: { data: any; type: FormActionType }) {
  dialogRef.value?.show({ data, type })
}

defineExpose({ show })
</script>

<template>
  <FormDialogComponent ref="dialogRef" :options="formDialogOptions" />
</template>
