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
      fieldName: 'Host',
      label: $t('setting.config.email.host'),
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.host') },
    },
    {
      fieldName: 'Port',
      label: $t('setting.config.email.port'),
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.port') },
    },
    {
      fieldName: 'Username',
      label: $t('setting.config.email.username'),
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.username') },
    },
    {
      fieldName: 'Password',
      label: $t('setting.config.email.password'),
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.password') },
    },
    {
      fieldName: 'SMTPSecure',
      label: $t('setting.config.email.smtp_secure'),
      component: 'Select',
      defaultValue: 'ssl',
      rules: 'required',
      componentProps: {
        options: [
          { label: 'ssl', value: 'ssl' },
          { label: 'tsl', value: 'tsl' },
        ],
      },
    },
    {
      fieldName: 'From',
      label: $t('setting.config.email.from'),
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.from') },
    },
    {
      fieldName: 'FromName',
      label: $t('setting.config.email.from_name'),
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: $t('setting.config.email.placeholder.from_name') },
    },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const content = await formApi.getValues()
  await ConfigService.update('email', {
    group_code: 'setting',
    code: 'email',
    name: '邮箱设置',
    content,
  })
  ElMessage.success($t('common.operation_success'))
  retrieveData()
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('email')) as any
  await formApi.setValues({ ...record })
}

onMounted(() => {
  retrieveData()
})
</script>
