<template>
  <div class="p-4">
    <BasicForm />
    <div class="mt-4 ml-[130px]">
      <ElButton type="primary" @click="onSubmit">{{ $t('setting.config.button.submit') }}</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { ElButton, ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { $t } from '#/locales'
import { ConfigService } from '#/api/setting/config'

const [BasicForm, formApi] = useVbenForm({
  layout: 'horizontal',
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-1',
  schema: [
    { component: 'Input', fieldName: 'app_name', label: $t('setting.config.common.app_name'),
      componentProps: { placeholder: $t('setting.config.common.placeholder.app_name'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'app_version', label: $t('setting.config.common.app_version'),
      componentProps: { placeholder: $t('setting.config.common.placeholder.app_version'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'company_name', label: $t('setting.config.common.company_name'),
      componentProps: { placeholder: $t('setting.config.common.placeholder.company_name'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'company_url', label: $t('setting.config.common.company_url'),
      componentProps: { placeholder: $t('setting.config.common.placeholder.company_url'), clearable: true, style: { width: '60%' } } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'system',
    code: 'common_setting',
    name: '通用设置',
    content: values,
  }
  await ConfigService.update('common_setting', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function retrieveData() {
  const record = await ConfigService.getByCode('common_setting') as any
  if (record) {
    await formApi.setValues(record)
  }
}

onMounted(() => {
  retrieveData()
})
</script>
