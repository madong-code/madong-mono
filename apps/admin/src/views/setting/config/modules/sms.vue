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
import { $t } from '#/locales'
import { ConfigService } from '#/api/setting/config'

const [BasicForm, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: { labelWidth: 130 },
  schema: [
    {
      fieldName: 'platform',
      label: $t('setting.config.sms.platform'),
      component: 'Select',
      defaultValue: 'aliyun',
      componentProps: {
        options: [
          { label: '阿里云', value: 'aliyun' },
          { label: '腾讯云', value: 'tencent' },
        ],
      },
    },
    {
      fieldName: 'app_id',
      label: $t('setting.config.sms.app_id'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.sms.placeholder.app_id') },
    },
    {
      fieldName: 'app_key',
      label: $t('setting.config.sms.app_key'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.sms.placeholder.app_key') },
    },
    {
      fieldName: 'sign_name',
      label: $t('setting.config.sms.sign_name'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.sms.placeholder.sign_name') },
    },
    {
      fieldName: 'template_code',
      label: $t('setting.config.sms.template_code'),
      component: 'Input',
      componentProps: { placeholder: $t('setting.config.sms.placeholder.template_code') },
    },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const content = await formApi.getValues()
  await ConfigService.update('sms', {
    group_code: 'setting',
    code: 'sms',
    name: '短信设置',
    content,
  })
  ElMessage.success($t('common.operation_success'))
  retrieveData()
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('sms')) as any
  await formApi.setValues({ ...record })
}

onMounted(() => {
  retrieveData()
})
</script>
