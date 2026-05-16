<template>
  <el-dialog v-model="visible" :title="$t('tools.delegation.dialog.title')" width="500px" @close="handleClose">
    <BasicForm />
    <template #footer>
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { $t } from '#/locales'
import { ToolsAuthService } from '#/api/tools'

const visible = ref(false)

const [BasicForm, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: { labelWidth: 120 },
  schema: [
    { fieldName: 'auth_code', label: $t('tools.delegation.dialog.auth_code'), component: 'Input', rules: 'required' },
    { fieldName: 'auth_secret', label: $t('tools.delegation.dialog.auth_secret'), component: 'Input', rules: 'required', componentProps: { type: 'password' } },
  ],
})

const handleClose = () => { visible.value = false; formApi.resetForm() }

const handleSubmit = async () => {
  const { valid } = await formApi.validate()
  if (!valid) return
  const data = await formApi.getValues()
  await ToolsAuthService.setAuthInfo(data)
  ElMessage.success($t('common.operation_success'))
  handleClose()
}

const openDialog = () => { visible.value = true }

defineExpose({ openDialog })
</script>
