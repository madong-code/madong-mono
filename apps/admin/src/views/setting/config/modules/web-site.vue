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

const [BasicForm, formApi] = useVbenForm({
  layout: 'horizontal',
  commonConfig: {
    componentProps: { class: 'w-full' },
  },
  wrapperClass: 'grid-cols-1',
  schema: [
    { component: 'Input', fieldName: 'site_name', label: $t('setting.config.web_site.site_name'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.site_name'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'site_url', label: $t('setting.config.web_site.site_url'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.site_url'), clearable: true, style: { width: '40%' } } },
    { component: 'Avatar', fieldName: 'logo', label: $t('setting.config.web_site.logo') },
    { component: 'Input', fieldName: 'seo_title', label: $t('setting.config.web_site.seo_title'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.seo_title'), clearable: true, style: { width: '60%' } } },
    { component: 'Input', fieldName: 'seo_keywords', label: $t('setting.config.web_site.seo_keywords'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.seo_keywords'), clearable: true, style: { width: '60%' } } },
    { component: 'Input', fieldName: 'seo_description', label: $t('setting.config.web_site.seo_description'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.seo_description'), clearable: true, style: { width: '60%' }, type: 'textarea', rows: 4 } },
    { component: 'Avatar', fieldName: 'share_image', label: $t('setting.config.web_site.share_image') },
    { component: 'Input', fieldName: 'copyright', label: $t('setting.config.web_site.copyright'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.copyright'), clearable: true, style: { width: '60%' } } },
    { component: 'Input', fieldName: 'icp', label: $t('setting.config.web_site.icp'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.icp'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'icp_url', label: $t('setting.config.web_site.icp_url'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.icp_url'), clearable: true, style: { width: '60%' } } },
    { component: 'Input', fieldName: 'network_security', label: $t('setting.config.web_site.network_security'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.network_security'), clearable: true, style: { width: '40%' } } },
    { component: 'Input', fieldName: 'network_security_url', label: $t('setting.config.web_site.network_security_url'),
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.network_security_url'), clearable: true, style: { width: '60%' } } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'system',
    code: 'web_site_setting',
    name: '前台站点设置',
    content: values,
  }
  await ConfigService.update('web_site_setting', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function retrieveData() {
  const record = await ConfigService.getByCode('web_site_setting') as any
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
