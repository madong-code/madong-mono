<template>
  <div class="p-4">
    <BasicForm />
    <div class="mt-4 ml-[130px]">
      <ElButton type="primary" @click="onSubmit">{{ $t('setting.config.button.submit') }}</ElButton>
      <ElButton type="primary" @click="handleMoreSetting">{{ $t('setting.config.upload.more_setting') }}</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { ElButton, ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { $t } from '#/locales'
import { ConfigService } from '#/api/setting/config'
import { DictEnum } from '#/enums/dict-enum'

const drawerVisible = ref(false)
const advancedForm = ref<Record<string, any>>({})

const [BasicForm, formApi] = useVbenForm({
  layout: 'horizontal',
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-1',
  schema: [
    { component: 'ApiDict', fieldName: 'mode', label: $t('setting.config.upload.mode'),
      defaultValue: 'local',
      componentProps: { renderType: 'RadioGroup', isBtn: true, code: DictEnum.SYS_CLOUD_STORAGE } },
    { component: 'Input', fieldName: 'single_limit', label: $t('setting.config.upload.single_limit'),
      componentProps: { placeholder: '1024', style: { width: '50%' } } },
    { component: 'Input', fieldName: 'total_limit', label: $t('setting.config.upload.total_limit'),
      componentProps: { placeholder: '1024', style: { width: '50%' } } },
    { component: 'Input', fieldName: 'nums', label: $t('setting.config.upload.nums'),
      componentProps: { placeholder: '1', style: { width: '50%' } } },
    { component: 'Input', fieldName: 'exclude', label: $t('setting.config.upload.exclude'),
      componentProps: { placeholder: '', style: { width: '50%' } } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'setting',
    code: 'upload',
    name: '上传设置',
    content: { ...values, advanced: advancedForm.value },
  }
  await ConfigService.update('upload', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function handleMoreSetting() {
  const values = await formApi.getValues()
  advancedForm.value = values.advanced || {}
  drawerVisible.value = true
}

async function retrieveData() {
  const record = await ConfigService.getByCode('upload') as any
  if (record) {
    if (record.advanced) {
      advancedForm.value = record.advanced
      delete record.advanced
    }
    await formApi.setValues(record)
  }
}

onMounted(() => {
  retrieveData()
})
</script>
