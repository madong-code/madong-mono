<template>
  <div class="p-4">
    <BasicForm />
    <div class="mt-4 ml-[100px]">
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
    { component: 'Input', fieldName: 'site_name', label: $t('setting.config.site.site_name'),
      componentProps: { placeholder: $t('setting.config.site.placeholder.site_name'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'site_url', label: $t('setting.config.site.site_url'),
      componentProps: { placeholder: $t('setting.config.site.placeholder.site_url'), clearable: true, style: { width: '40%' } } },
    { component: 'ApiDict', fieldName: 'site_open', label: $t('setting.config.site.site_open'),
      defaultValue: 1,
      componentProps: { renderType: 'RadioGroup', isBtn: true, code: DictEnum.SYS_ENABLED_STATUS } },
    { component: 'Input', fieldName: 'site_record_no', label: $t('setting.config.site.site_record_no'),
      componentProps: { placeholder: $t('setting.config.site.placeholder.site_record_no'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'site_icp_url', label: $t('setting.config.site.site_icp_url'),
      componentProps: { placeholder: $t('setting.config.site.placeholder.site_icp_url'), clearable: true, style: { width: '60%' } } },
    { component: 'Input', fieldName: 'site_network_security', label: $t('setting.config.site.site_network_security'),
      componentProps: { placeholder: $t('setting.config.site.placeholder.site_network_security'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'site_network_security_url', label: $t('setting.config.site.site_network_security_url'),
      componentProps: { placeholder: $t('setting.config.site.placeholder.site_network_security_url'), clearable: true, style: { width: '60%' } } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'system',
    code: 'site_setting',
    name: '站点设置',
    content: values,
  }
  await ConfigService.update('site_setting', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function retrieveData() {
  const record = await ConfigService.getByCode('site_setting') as any
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
