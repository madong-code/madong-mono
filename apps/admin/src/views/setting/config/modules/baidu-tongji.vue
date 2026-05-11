<template>
  <div class="p-4">
    <BasicForm />
    <div class="mt-4 ml-[120px]">
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
    { component: 'ApiDict', fieldName: 'baidu_tongji_enabled', label: $t('setting.config.baidu_tongji.baidu_tongji_enabled'),
      defaultValue: 0,
      componentProps: { renderType: 'RadioGroup', isBtn: true, code: DictEnum.SYS_ENABLED_STATUS } },
    { component: 'Input', fieldName: 'baidu_tongji_code', label: $t('setting.config.baidu_tongji.baidu_tongji_code'),
      componentProps: { placeholder: $t('setting.config.baidu_tongji.placeholder.baidu_tongji_code'), clearable: true, style: { width: '60%' } } },
  ],
})

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const values = await formApi.getValues()
  const data = {
    group_code: 'system',
    code: 'baidu_tongji_setting',
    name: '百度统计设置',
    content: values,
  }
  await ConfigService.update('baidu_tongji_setting', data)
  ElMessage.success($t('common.operationSuccess'))
  retrieveData()
}

async function retrieveData() {
  const record = await ConfigService.getByCode('baidu_tongji_setting') as any
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
