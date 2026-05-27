<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed } from 'vue';

import { ProfilePasswordSetting, z } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { changePasswordApi } from '#/api';
import { useAuthStore } from '#/store';

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'old_password',
      label: '旧密码',
      component: 'VbenInputPassword',
      rules: 'required',
      componentProps: {
        placeholder: '请输入旧密码',
      },
    },
    {
      fieldName: 'new_password',
      label: '新密码',
      component: 'VbenInputPassword',
      rules: 'required',
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入新密码',
      },
    },
    {
      fieldName: 'confirm_password',
      label: '确认密码',
      component: 'VbenInputPassword',
      rules: 'required',
      componentProps: {
        passwordStrength: true,
        placeholder: '请再次输入新密码',
      },
      dependencies: {
        rules(values) {
          const { new_password } = values;
          return z
            .string({ required_error: '请再次输入新密码' })
            .min(1, { message: '请再次输入新密码' })
            .refine((value) => value === new_password, {
              message: '两次输入的密码不一致',
            });
        },
        triggerFields: ['new_password'],
      },
    },
  ];
});

async function handleSubmit(values: Record<string, any>) {
  try {
    await changePasswordApi({
      old_password: values.old_password,
      new_password: values.new_password,
    });
    ElMessage.success('密码修改成功，请重新登录');
    const authStore = useAuthStore();
    await authStore.logout();
  } catch (e: any) {
    ElMessage.error(e?.message || '密码修改失败');
  }
}
</script>
<template>
  <ProfilePasswordSetting
    class="w-full"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
