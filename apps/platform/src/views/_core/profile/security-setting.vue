<script setup lang="ts">
import { computed } from 'vue';

import { ProfileSecuritySetting } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();

const formSchema = computed(() => {
  const user = userStore.userInfo;
  const email = user?.email || '';
  const mobile = user?.mobile_phone || '';
  const maskedEmail = email ? email.replace(/(.{3}).+(.{2}@)/, '$1***$2') : '未绑定';
  const maskedMobile = mobile ? mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : '未绑定';

  return [
    {
      value: true,
      fieldName: 'accountPassword',
      label: '账户密码',
      description: '当前密码强度：强',
    },
    {
      value: !!mobile,
      fieldName: 'securityPhone',
      label: '密保手机',
      description: mobile ? `已绑定手机：${maskedMobile}` : '未绑定手机',
    },
    {
      value: false,
      fieldName: 'securityQuestion',
      label: '密保问题',
      description: '未设置密保问题，密保问题可有效保护账户安全',
    },
    {
      value: !!email,
      fieldName: 'securityEmail',
      label: '备用邮箱',
      description: email ? `已绑定邮箱：${maskedEmail}` : '未绑定邮箱',
    },
    {
      value: false,
      fieldName: 'securityMfa',
      label: 'MFA 设备',
      description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    },
  ];
});
</script>
<template>
  <ProfileSecuritySetting :form-schema="formSchema" />
</template>
