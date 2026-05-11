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
    { component: 'Input', fieldName: 'Host', label: $t('setting.config.email.Host'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.Host'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'Port', label: $t('setting.config.email.Port'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.Port'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'Username', label: $t('setting.config.email.Username'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.Username'), style: { width: '40%' } } },
    { component: 'Input', fieldName: 'Password', label: $t('setting.config.email.Password'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.Password'), clearable: true, style: { width: '40%' } } },
    { component: 'RadioGroup', fieldName: 'SMTPSecure', label: $t('setting.config.email.SMTPSecure'), defaultValue: 'ssl',
      componentProps: { options: [{ label: 'ssl', value: 'ssl' }, { label: 'tsl', value: 'tsl' }] } },
    { component: 'Input', fieldName: 'From', label: $t('setting.config.email.From'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.From'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'FromName', label: $t('setting.config.email.FromName'), rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.FromName'), clearable: true, style: { width: '40%' } } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'setting',
    code: 'email',
    name: '邮箱设置',
    content: values,
  }
  await ConfigService.update('email', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function retrieveData() {
  const record = await ConfigService.getByCode('email') as any
  if (record) {
    await formApi.setValues(record)
  }
}

onMounted(() => {
  retrieveData()
})
</script>
