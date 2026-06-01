<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ElButton, ElMessage, ElRow } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ConfigService } from '#/api/system/config';
import { DictEnum } from '#/enums';
import { $t } from '#/locales';

import UploadSettingDrawer from './upload-ext-drawer.vue';

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
});

const uploadSettingDrawerRef = ref();

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;
  const content = await formApi.getValues();
  await ConfigService.update('upload', {
    group_code: 'setting',
    code: 'upload',
    name: '上传设置',
    content,
  });
  ElMessage.success($t('common.operation_success'));
  retrieveData();
}

async function handleSetting() {
  const values = await formApi.getValues();
  uploadSettingDrawerRef.value.show(values);
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('upload')) as any;
  await formApi.setValues({ ...record });
};

onMounted(() => {
  retrieveData();
});
</script>

<template>
  <div>
    <BasicForm />
    <ElRow class="ml-[130px] gap-2">
      <ElButton type="primary" @click="onSubmit">
{{
        $t('common.save')
      }}
</ElButton>
      <ElButton type="primary" @click="handleSetting">
{{
        $t('setting.config.upload.more')
      }}
</ElButton>
    </ElRow>
    <UploadSettingDrawer ref="uploadSettingDrawerRef" />
  </div>
</template>
