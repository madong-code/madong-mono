<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElRadio,
  ElRadioGroup,
} from 'element-plus';

import { ConfigService } from '#/api/system/config';
import { $t } from '#/locales';

const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();
const crudApiRef = ref<any>(null);

const formData = reactive({
  code: '',
  name: '',
  content: '',
  remark: '',
  enabled: 1,
  group_code: 'common',
});

const rules = {
  code: [{ required: true, message: $t('common.required'), trigger: 'blur' }],
  name: [{ required: true, message: $t('common.required'), trigger: 'blur' }],
};

const handleClose = () => {
  formRef.value?.resetFields();
};

const show = ({ data, isEdit: edit, getCrudApi }: any) => {
  isEdit.value = edit;
  crudApiRef.value = getCrudApi;
  if (edit && data) {
    Object.assign(formData, data);
  } else {
    formData.code = '';
    formData.name = '';
    formData.content = '';
    formData.remark = '';
    formData.enabled = 1;
    formData.group_code = 'common';
  }
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    const params = { ...formData };
    await (isEdit.value
      ? ConfigService.update(params.code, params)
      : ConfigService.save(params));
    ElMessage.success($t('common.operation_success'));
    dialogVisible.value = false;
    crudApiRef.value?.()?.reload?.();
  } catch {
    // validation failed
  }
};

defineExpose({ show });
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="
      isEdit
        ? $t('system.config.common.dialog.edit_title')
        : $t('system.config.common.dialog.create_title')
    "
    width="600px"
    @close="handleClose"
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem :label="$t('system.config.common.form.code')" prop="code">
        <ElInput
          v-model="formData.code"
          :placeholder="$t('system.config.common.form.placeholder.code')"
          :disabled="isEdit"
        />
      </ElFormItem>
      <ElFormItem :label="$t('system.config.common.form.name')" prop="name">
        <ElInput
          v-model="formData.name"
          :placeholder="$t('system.config.common.form.placeholder.name')"
        />
      </ElFormItem>
      <ElFormItem
        :label="$t('system.config.common.form.enabled')"
        prop="enabled"
      >
        <ElRadioGroup v-model="formData.enabled">
          <ElRadio :value="1">{{ $t('common.enabled') }}</ElRadio>
          <ElRadio :value="0">{{ $t('common.disabled') }}</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem
        :label="$t('system.config.common.form.content')"
        prop="content"
      >
        <ElInput
          v-model="formData.content"
          type="textarea"
          :rows="10"
          :placeholder="$t('system.config.common.form.placeholder.content')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('system.config.common.form.remark')" prop="remark">
        <ElInput
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          :placeholder="$t('system.config.common.form.placeholder.remark')"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="dialogVisible = false">
        {{ $t('common.cancel') }}
      </ElButton>
      <ElButton type="primary" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </ElButton>
    </template>
  </ElDialog>
</template>
