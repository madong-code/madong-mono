<script setup lang="ts">
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import {
  ProfilePasswordSetting,
  ProfileSecuritySetting,
  z,
} from '@vben/common-ui';

import { ElLoading, ElMessage } from 'element-plus';

import { ProfileService } from '#/api/auth/profile';
import { useAuthStore } from '#/store';

// 密码修改表单
const passwordFormSchema = computed((): VbenFormSchema[] => [
  {
    fieldName: 'oldPassword',
    label: '旧密码',
    component: 'VbenInputPassword',
    componentProps: { placeholder: '请输入旧密码' },
  },
  {
    fieldName: 'newPassword',
    label: '新密码',
    component: 'VbenInputPassword',
    componentProps: { passwordStrength: true, placeholder: '请输入新密码' },
  },
  {
    fieldName: 'confirmPassword',
    label: '确认密码',
    component: 'VbenInputPassword',
    componentProps: { passwordStrength: true, placeholder: '请再次输入新密码' },
    dependencies: {
      rules(values: any) {
        const { newPassword } = values;
        return z
          .string({ required_error: '请再次输入新密码' })
          .min(1, { message: '请再次输入新密码' })
          .refine((value: string) => value === newPassword, {
            message: '两次输入的密码不一致',
          });
      },
      triggerFields: ['newPassword'],
    },
  },
]);

async function handlePasswordSubmit(values: Record<string, any>) {
  const loading = ElLoading.service({
    lock: true,
    text: '正在修改密码...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    await ProfileService.updatePassword({
      old_password: values.oldPassword,
      new_password: values.newPassword,
      confirm_password: values.confirmPassword,
    });

    // 成功提示 + 倒计时跳转登录
    let seconds = 5;
    let messageHandler: any = null;

    const updateMessage = () => {
      if (messageHandler) messageHandler.close();
      messageHandler = ElMessage.success({
        message: `密码修改成功，${seconds}秒后将自动跳转到登录页面`,
        duration: 0,
        showClose: true,
      });
    };

    updateMessage();

    const timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timer);
        if (messageHandler) messageHandler.close();
        const authStore = useAuthStore();
        authStore.logout();
      } else {
        updateMessage();
      }
    }, 1000);
  } catch (error: any) {
    ElMessage.error(error?.message || '密码修改失败');
  } finally {
    loading.close();
  }
}

// 安全设置列表
const securitySchema = computed(() => [
  {
    value: true,
    fieldName: 'accountPassword',
    label: '账户密码',
    description: '当前密码强度：强',
  },
  {
    value: true,
    fieldName: 'securityPhone',
    label: '密保手机',
    description: '已绑定手机：138****8293',
  },
  {
    value: false,
    fieldName: 'securityQuestion',
    label: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
  },
  {
    value: true,
    fieldName: 'securityEmail',
    label: '备用邮箱',
    description: '已绑定邮箱：ant***sign.com',
  },
  {
    value: false,
    fieldName: 'securityMfa',
    label: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后可以进行二次确认',
  },
]);
</script>

<template>
  <div class="security-setting">
    <!-- 安全状态 -->
    <div class="setting-card">
      <ProfileSecuritySetting :form-schema="securitySchema" />
    </div>

    <!-- 修改密码 -->
    <div class="setting-card password-card">
      <div class="card-header">
        <h3>修改密码</h3>
        <p class="card-desc">定期更换密码可以提高账户安全性</p>
      </div>
      <ProfilePasswordSetting
        class="password-form"
        :form-schema="passwordFormSchema"
        @submit="handlePasswordSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
.security-setting {
  width: 100%;
}

.setting-card {
  padding: 24px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.password-card {
  margin-top: 16px;
}

.card-header {
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.password-form {
  max-width: 100%;
}
</style>
