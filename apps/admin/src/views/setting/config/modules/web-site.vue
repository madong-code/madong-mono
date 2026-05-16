<template>
  <div>
    <BasicForm />
    <el-button class="ml-[130px] mt-4" type="primary" @click="onSubmit">{{ $t('common.save') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'
import { ConfigService } from '#/api/setting/config'

const [BasicForm, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: { labelWidth: 130 },
  schema: [
    {
      fieldName: 'web_open',
      label: $t('setting.config.web_site.open'),
      component: 'ApiDict',
      defaultValue: 1,
      componentProps: { renderType: 'RadioGroup', isBtn: true, code: DictEnum.SYS_ENABLED_STATUS },
    },
    {
      fieldName: 'web_url',
      label: $t('setting.config.web_site.url'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.url') },
    },
    {
      fieldName: 'web_name',
      label: $t('setting.config.web_site.name'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.name') },
    },
    {
      fieldName: 'web_logo',
      label: $t('setting.config.web_site.logo'),
      component: 'Avatar',
    },
    {
      fieldName: 'web_network_security',
      label: $t('setting.config.web_site.network_security'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.network_security') },
    },
    {
      fieldName: 'web_record_no',
      label: $t('setting.config.web_site.record_no'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.web_site.placeholder.record_no') },
    },
    {
      fieldName: 'web_description',
      label: $t('setting.config.web_site.description'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: $t('setting.config.web_site.placeholder.description'),
      },
    },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const content = await formApi.getValues()
  await ConfigService.update('web_site_setting', {
    group_code: 'system',
    code: 'web_site_setting',
    name: $t('setting.config.web_site.title'),
    content,
  })
  ElMessage.success($t('common.operation_success'))
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('web_site_setting')) as any
  await formApi.setValues({ ...record })
}

onMounted(() => { retrieveData() })
</script>
