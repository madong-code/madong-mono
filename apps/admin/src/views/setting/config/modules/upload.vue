<template>
  <div>
    <BasicForm />
    <el-row class="ml-[130px] gap-2">
      <el-button type="primary" @click="onSubmit">{{ $t('common.save') }}</el-button>
      <el-button type="primary" @click="handleSetting">{{ $t('setting.config.upload.more') }}</el-button>
    </el-row>
    <UploadSettingDrawer ref="uploadSettingDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useVbenForm } from '#/adapter/form'
import { $t } from '#/locales'
import { ConfigService } from '#/api/setting/config'
import { DictEnum } from '#/enums'
import UploadSettingDrawer from './upload-ext-drawer.vue'

const [BasicForm, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: { labelWidth: 130 },
  schema: [
    {
      fieldName: 'mode',
      label: $t('setting.config.upload.mode'),
      component: 'ApiDict',
      defaultValue: 'local',
      componentProps: {
        renderType: 'RadioGroup',
        code: DictEnum.SYS_CLOUD_STORAGE,
        isBtn: true,
      },
    },
    {
      fieldName: 'single_limit',
      label: $t('setting.config.upload.single_limit'),
      component: 'Input',
      componentProps: { placeholder: '1024' },
    },
    {
      fieldName: 'total_limit',
      label: $t('setting.config.upload.total_limit'),
      component: 'Input',
      componentProps: { placeholder: '1024' },
    },
    {
      fieldName: 'nums',
      label: $t('setting.config.upload.nums'),
      component: 'Input',
      componentProps: { placeholder: '1' },
    },
    {
      fieldName: 'exclude',
      label: $t('setting.config.upload.exclude'),
      component: 'Input',
    },
  ],
})

const uploadSettingDrawerRef = ref()

async function onSubmit() {
  const { valid } = await formApi.validate()
  if (!valid) return
  const content = await formApi.getValues()
  await ConfigService.update('upload', {
    group_code: 'setting',
    code: 'upload',
    name: '上传设置',
    content,
  })
  ElMessage.success($t('common.operation_success'))
  retrieveData()
}

async function handleSetting() {
  const values = await formApi.getValues()
  uploadSettingDrawerRef.value.show(values)
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('upload')) as any
  await formApi.setValues({ ...record })
}

onMounted(() => {
  retrieveData()
})
</script>
