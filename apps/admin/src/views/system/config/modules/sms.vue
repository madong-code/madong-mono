<script setup lang="ts">
import { onMounted } from 'vue';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { ConfigService } from '#/api/system/config';
import { $t } from '#/locales';

const [BasicForm, formApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: { labelWidth: 130 },
  schema: [
    {
      fieldName: 'platform',
      label: $t('system.config.sms.platform'),
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
      label: $t('system.config.sms.app_id'),
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.sms.placeholder.app_id'),
      },
    },
    {
      fieldName: 'app_key',
      label: $t('system.config.sms.app_key'),
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.sms.placeholder.app_key'),
      },
    },
    {
      fieldName: 'sign_name',
      label: $t('system.config.sms.sign_name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.sms.placeholder.sign_name'),
      },
    },
    {
      fieldName: 'template_code',
      label: $t('system.config.sms.template_code'),
      component: 'Input',
      componentProps: {
        placeholder: $t('system.config.sms.placeholder.template_code'),
      },
    },
  ],
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) return;
  const content = await formApi.getValues();
  await ConfigService.update('sms', {
    group_code: 'setting',
    code: 'sms',
    name: '短信设置',
    content,
  });
  ElMessage.success($t('common.operation_success'));
  retrieveData();
}

const retrieveData = async () => {
  const record = (await ConfigService.getByCode('sms')) as any;
  await formApi.setValues({ ...record });
};

onMounted(() => {
  retrieveData();
});
</script>

<template>
  <div>
    <BasicForm />
    <div class="flex justify-end mt-4">
      <ElButton type="primary" @click="onSubmit">
        {{ $t('common.save') }}
      </ElButton>
    </div>
  </div>
</template>
