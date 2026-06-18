<script setup lang="ts">
/** 模块市场路由：平台默认顶级管理员单一模式，直接显示单体市场页面 */
import StandaloneModuleMarket from './standalone/standalone-module-market.vue';

defineOptions({ name: 'MarketRouter' });
</script>

<template>
  <div class="h-full flex flex-col">
    <StandaloneModuleMarket class="flex-1" />
  </div>
</template>
