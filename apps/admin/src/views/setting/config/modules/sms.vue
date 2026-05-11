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
import { DictEnum } from '#/enums/dict-enum'

const [BasicForm, formApi] = useVbenForm({
  layout: 'horizontal',
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-1',
  schema: [
    { component: 'Input', fieldName: 'access_key_id', label: $t('setting.config.sms.access_key_id'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.sms.placeholder.access_key_id'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'access_key_secret', label: $t('setting.config.sms.access_key_secret'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.sms.placeholder.access_key_secret'), clearable: true, style: { width: '40%' } } },
    { component: 'ApiDict', fieldName: 'enable', label: $t('setting.config.sms.enable'), defaultValue: 1,
      componentProps: { renderType: 'RadioGroup', isBtn: true, code: DictEnum.SYS_ENABLED_STATUS } },
    { component: 'Input', fieldName: 'sign_name', label: $t('setting.config.sms.sign_name'),
      componentProps: { type: 'textarea', rows: 7, placeholder: $t('setting.config.sms.placeholder.sign_name'), clearable: true } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'setting',
    code: 'sms',
    name: '短信设置',
    content: values,
  }
  await ConfigService.update('sms', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function retrieveData() {
  const record = await ConfigService.getByCode('sms') as any
  if (record) {
    await formApi.setValues(convertStringNumbers(record))
  }
}

function convertStringNumbers(obj: Record<string, any>): Record<string, any> {
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
      obj[key] = Number(value)
    }
  })
  return obj
}

onMounted(() => {
  retrieveData()
})
</script>
