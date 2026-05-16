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
      fieldName: 'baidu_open',
      label: $t('setting.config.baidu_tongji.open'),
      component: 'ApiDict',
      defaultValue: 0,
      componentProps: { renderType: 'RadioGroup', isBtn: true, code: DictEnum.SYS_ENABLED_STATUS },
    },
    {
      fieldName: 'baidu_tongji_code',
      label: $t('setting.config.baidu_tongji.code'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 8,
        placeholder: $t('setting.config.baidu_tongji.placeholder.code'),
      },
    },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const content = await formApi.getValues()
  await ConfigService.update('baidu_tongji', {
    group_code: 'system',
    code: 'baidu_tongji',
    name: $t('setting.config.baidu_tongji.title'),
    content,
  })
  ElMessage.success($t('common.operation_success'))
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('baidu_tongji')) as any
  await formApi.setValues({ ...record })
}

onMounted(() => { retrieveData() })
</script>
