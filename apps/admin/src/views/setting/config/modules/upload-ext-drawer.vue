<template>
  <el-drawer v-model="visible" :title="$t('setting.config.upload.advanced')" size="500px" @close="handleClose">
    <el-form :model="formData" label-width="120px">
      <el-form-item v-for="(label, key) in currentGroupFields" :key="key" :label="label">
        <el-input v-model="formData[key]" :placeholder="label" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSave">{{ $t('common.save') }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ConfigService } from '#/api/setting/config'
import { templateField, convertStringNumbers } from '../schemas'
import { $t } from '#/locales'

const visible = ref(false)
const formData = reactive<Record<string, any>>({})
const currentMode = ref('')

const fieldLabelMap: Record<string, Record<string, string>> = {
  root: { root: '根目录' },
  domain: { domain: '域名' },
  dirname: { dirname: '目录名' },
  accessKeyId: { accessKeyId: 'AccessKey ID' },
  accessKeySecret: { accessKeySecret: 'AccessKey Secret' },
  bucket: { bucket: 'Bucket' },
  endpoint: { endpoint: 'Endpoint' },
  region: { region: 'Region' },
  remark: { remark: '备注' },
  accessKey: { accessKey: 'AccessKey' },
  secretKey: { secretKey: 'SecretKey' },
  key: { key: 'Key' },
  secret: { secret: 'Secret' },
  version: { version: 'Version' },
  acl: { acl: 'ACL' },
}

const currentGroupFields = computed(() => {
  const fields = templateField(currentMode.value)
  const result: Record<string, string> = {}
  fields.forEach((f: string) => {
    result[f] = fieldLabelMap[f]?.[f] || f
  })
  return result
})

const show = (values: Record<string, any>) => {
  currentMode.value = values.mode || ''
  Object.assign(formData, values)
  visible.value = true
}

const handleClose = () => {
  Object.keys(formData).forEach((k) => delete formData[k])
}

const handleSave = async () => {
  try {
    await ConfigService.update('upload', {
      group_code: 'setting',
      code: 'upload',
      name: '上传设置',
      content: convertStringNumbers({ ...formData, mode: currentMode.value }),
    })
    ElMessage.success($t('common.operation_success'))
    visible.value = false
  } catch {
    ElMessage.error($t('common.operation_failed'))
  }
}

defineExpose({ show })
</script>
