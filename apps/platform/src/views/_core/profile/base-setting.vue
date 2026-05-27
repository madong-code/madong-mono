<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { getUserInfoApi, updateUserInfoApi } from '#/api';

const userStore = useUserStore();
const profileBaseSettingRef = ref();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'real_name',
      component: 'Input',
      label: '姓名',
      rules: 'required',
    },
    {
      fieldName: 'nick_name',
      component: 'Input',
      label: '昵称',
    },
    {
      fieldName: 'email',
      component: 'Input',
      label: '邮箱',
      rules: 'email',
    },
    {
      fieldName: 'mobile_phone',
      component: 'Input',
      label: '手机号',
      rules: 'mobile',
    },
  ];
});

onMounted(async () => {
  const data = await getUserInfoApi();
  // 后端返回 snake_case, 表单字段直接用 snake_case 匹配
  profileBaseSettingRef.value.getFormApi().setValues(data);
});

async function handleSubmit(values: Record<string, any>) {
  try {
    await updateUserInfoApi(values);
    // 刷新 store 中的用户信息
    const userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    ElMessage.success('基本信息更新成功');
  } catch (e: any) {
    ElMessage.error(e?.message || '更新失败');
  }
}
</script>
<template>
  <ProfileBaseSetting ref="profileBaseSettingRef" :form-schema="formSchema" @submit="handleSubmit" />
</template>
