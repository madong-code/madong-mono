<template>
  <div>
    <BasicForm />
    <el-button class="ml-[100px] mt-4" type="primary" @click="onSubmit">
      {{ $t('common.save') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { DictEnum } from '#/enums'
import { $t } from '#/locales'
import { convertStringNumbers } from '../schemas'
import { ConfigService } from '#/api/setting/config'

const formData = ref({})
const groupCode = 'system'

const [BasicForm, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: { labelWidth: 100 },
  schema: [
    {
      fieldName: 'site_open',
      label: $t('setting.config.site.open'),
      component: 'ApiDict',
      defaultValue: 1,
      componentProps: {
        renderType: 'RadioGroup',
        isBtn: true,
        code: DictEnum.SYS_ENABLED_STATUS,
      },
    },
    {
      fieldName: 'site_url',
      label: $t('setting.config.site.url'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.url'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_name',
      label: $t('setting.config.site.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.name'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_logo',
      label: $t('setting.config.site.logo'),
      component: 'Avatar',
    },
    {
      fieldName: 'site_network_security',
      label: $t('setting.config.site.network_security'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.network_security'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_keywords',
      label: $t('setting.config.site.keywords'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.keywords'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_record_no',
      label: $t('setting.config.site.record_no'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.record_no'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_icp_url',
      label: $t('setting.config.site.icp_url'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.icp_url'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_network_security_url',
      label: $t('setting.config.site.network_security_url'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.network_security_url'),
        clearable: true,
      },
    },
    {
      fieldName: 'site_description',
      label: $t('setting.config.site.description'),
      component: 'Input',
      componentProps: {
        placeholder: $t('setting.config.site.placeholder.description'),
        clearable: true,
        type: 'textarea',
        rows: 4,
      },
    },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return

  const content = await formApi.getValues()
  const values = {
    group_code: groupCode,
    code: 'site_setting',
    name: $t('setting.config.site.title'),
    content,
  }
  await ConfigService.update('site_setting', values)
  ElMessage.success($t('common.operation_success'))
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('site_setting')) as any
  await formApi.setValues(convertStringNumbers(record))
}

onMounted(() => {
  retrieveData()
})
</script>
