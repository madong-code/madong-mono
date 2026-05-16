<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? $t('setting.config.common.dialog.edit_title') : $t('setting.config.common.dialog.create_title')"
    width="600px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item :label="$t('setting.config.common.form.code')" prop="code">
        <el-input
          v-model="formData.code"
          :placeholder="$t('setting.config.common.form.placeholder.code')"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item :label="$t('setting.config.common.form.name')" prop="name">
        <el-input
          v-model="formData.name"
          :placeholder="$t('setting.config.common.form.placeholder.name')"
        />
      </el-form-item>
      <el-form-item :label="$t('setting.config.common.form.enabled')" prop="enabled">
        <el-radio-group v-model="formData.enabled">
          <el-radio :value="1">{{ $t('common.enabled') }}</el-radio>
          <el-radio :value="0">{{ $t('common.disabled') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('setting.config.common.form.content')" prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="10"
          :placeholder="$t('setting.config.common.form.placeholder.content')"
        />
      </el-form-item>
      <el-form-item :label="$t('setting.config.common.form.remark')" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          :placeholder="$t('setting.config.common.form.placeholder.remark')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { $t } from '#/locales'
import { ConfigService } from '#/api/setting/config'

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const crudApiRef = ref<any>(null)

const formData = reactive({
  code: '',
  name: '',
  content: '',
  remark: '',
  enabled: 1,
  group_code: 'common',
})

const rules = {
  code: [{ required: true, message: $t('common.required'), trigger: 'blur' }],
  name: [{ required: true, message: $t('common.required'), trigger: 'blur' }],
}

const handleClose = () => {
  formRef.value?.resetFields()
}

const show = ({ data, isEdit: edit, getCrudApi }: any) => {
  isEdit.value = edit
  crudApiRef.value = getCrudApi
  if (edit && data) {
    Object.assign(formData, data)
  } else {
    formData.code = ''
    formData.name = ''
    formData.content = ''
    formData.remark = ''
    formData.enabled = 1
    formData.group_code = 'common'
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    const params = { ...formData }
    if (isEdit.value) {
      await ConfigService.update(params.code, params)
    } else {
      await ConfigService.save(params)
    }
    ElMessage.success($t('common.operation_success'))
    dialogVisible.value = false
    crudApiRef.value?.()?.reload?.()
  } catch {
    // validation failed
  }
}

defineExpose({ show })
</script>
