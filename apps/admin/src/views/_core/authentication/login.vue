<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  getTenantListApi,
  getTenantModeFlagApi,
} from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

/** 租户模式开关 */
const tenantEnabled = ref(false);
const tenantAutoFirst = ref(true);
const tenantOptions = ref<{ label: string; value: string }[]>([]);

/** 获取租户数据 */
async function fetchTenantInfo() {
  try {
    const modeData = await getTenantModeFlagApi();
    tenantEnabled.value = modeData.enabled ?? false;
    tenantAutoFirst.value = modeData.auto_select_first ?? true;

    if (tenantEnabled.value) {
      const tenants = await getTenantListApi();
      tenantOptions.value = tenants.map((t) => ({
        label: `${t.name} (${t.code})`,
        value: String(t.id),
      }));
      // 未开启租户模式时隐藏该字段
    }
  } catch {
    // 接口失败时保持默认关闭状态
  }
}

onMounted(() => {
  fetchTenantInfo();
});

/** 表单提交处理：注入 tenant_id */
function handleLogin(values: Record<string, any>) {
  const params = { ...values };
  // 仅租户模式开启且有选中值时才传 tenant_id
  if (tenantEnabled.value && params.tenant_id) {
    params.tenant_id = params.tenant_id;
  } else {
    delete params.tenant_id;
  }
  authStore.authLogin(params);
}

const formSchema = computed((): VbenFormSchema[] => {
  const schemas: VbenFormSchema[] = [];

  // 租户模式下添加租户选择
  if (tenantEnabled.value && tenantOptions.value.length > 0) {
    schemas.push({
      component: 'VbenSelect',
      componentProps: {
        options: tenantOptions.value,
        placeholder: '请选择租户',
      },
      fieldName: 'tenant_id',
      label: '选择租户',
      rules: z.string().min(1, { message: '请选择租户' }),
      defaultValue: tenantAutoFirst.value
        ? tenantOptions.value[0]?.value
        : undefined,
    });
  }

  schemas.push(
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'user_name',
      label: $t('authentication.username'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  );

  return schemas;
});
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleLogin"
  />
</template>
