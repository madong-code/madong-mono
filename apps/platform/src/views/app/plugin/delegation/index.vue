<script setup lang="ts">
/** 平台端 - 授权信息(对接官网平台)
 *  - SaaS 授权码认证(公司名/域名/授权码 + 重新认证对话框)
 *  - 调 /plugin/auth-info (GET/POST)
 */
import StandaloneDelegation from './StandaloneDelegation.vue';

defineOptions({ name: 'AppPluginDelegation' });
</script>

<template>
  <div class="h-full">
    <StandaloneDelegation />
  </div>
</template>
