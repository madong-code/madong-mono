<template>
  <Page auto-content-height>
    <div class="flex items-center justify-center p-8">
      <ElCard shadow="hover" class="w-full max-w-2xl">
        <template #header>
          <span class="text-lg font-bold">{{ $t('tools.delegation.title') }}</span>
        </template>
        <div v-if="authInfo" class="space-y-4">
          <ElDescriptions :column="1" border>
            <ElDescriptionsItem :label="$t('tools.delegation.company_name')">
              {{ authInfo.company_name || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('tools.delegation.domain')">
              {{ authInfo.domain || '-' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('tools.delegation.auth_code')">
              <div class="flex items-center gap-2">
                <span v-if="!showCode">{{ maskedCode }}</span>
                <span v-else>{{ authInfo.auth_code || '-' }}</span>
                <ElButton link type="primary" @click="showCode = !showCode">
                  {{ showCode ? '隐藏' : '显示' }}
                </ElButton>
              </div>
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('tools.delegation.expire_time')">
              <ElTag :type="isExpired ? 'danger' : 'success'">
                {{ authInfo.expire_time || '-' }}
              </ElTag>
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('tools.delegation.modules')">
              <ElTag v-for="mod in (authInfo.modules || [])" :key="mod" class="mr-2" type="info">
                {{ mod }}
              </ElTag>
            </ElDescriptionsItem>
          </ElDescriptions>

          <div class="flex gap-4 pt-4">
            <ElButton type="primary" @click="authDialogVisible = true">
              {{ $t('tools.delegation.set_auth') }}
            </ElButton>
          </div>
        </div>
        <div v-else class="py-8 text-center text-gray-400">
          {{ $t('tools.delegation.no_auth_info') }}
        </div>
      </ElCard>
    </div>

    <ElDialog v-model="authDialogVisible" :title="$t('tools.delegation.set_auth')" width="500px">
      <BasicForm />
      <template #footer>
        <ElButton @click="authDialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="onSubmitAuth">确定</ElButton>
      </template>
    </ElDialog>
  </Page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { Page } from '@vben/common-ui'
import { ElCard, ElDescriptions, ElDescriptionsItem, ElTag, ElButton, ElDialog, ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { $t } from '#/locales'
import { ToolsAuthService } from '#/api/tools'

const authInfo = ref<any>(null)
const showCode = ref(false)
const authDialogVisible = ref(false)
const submitting = ref(false)

const maskedCode = computed(() => {
  const code = authInfo.value?.auth_code || ''
  if (code.length <= 8) return '****'
  return code.slice(0, 4) + '****' + code.slice(-4)
})

const isExpired = computed(() => {
  if (!authInfo.value?.expire_time) return true
  return new Date(authInfo.value.expire_time) < new Date()
})

const [BasicForm, formApi] = useVbenForm({
  schema: [
    { component: 'Input', fieldName: 'auth_code', label: $t('tools.delegation.auth_code'), rules: 'required',
      componentProps: { placeholder: $t('tools.delegation.placeholder.auth_code'), clearable: true } },
    { component: 'Input', fieldName: 'secret_key', label: $t('tools.delegation.secret_key'), rules: 'required',
      componentProps: { placeholder: $t('tools.delegation.placeholder.secret_key'), clearable: true } },
  ],
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-1',
})

async function onSubmitAuth() {
  const { valid } = await formApi.validate()
  if (!valid) return
  submitting.value = true
  try {
    const values = await formApi.getValues()
    await ToolsAuthService.setAuthInfo(values)
    ElMessage.success($t('common.operationSuccess'))
    authDialogVisible.value = false
    formApi.resetForm()
    retrieveData()
  } finally {
    submitting.value = false
  }
}

async function retrieveData() {
  try {
    authInfo.value = await ToolsAuthService.getAuthInfo()
  } catch {
    authInfo.value = null
  }
}

onMounted(() => {
  retrieveData()
})
</script>
