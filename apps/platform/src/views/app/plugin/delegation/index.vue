<script setup lang="ts">
/** 授权管理：平台默认顶级管理员单一模式，直接显示单体授权页面 */
import StandaloneDelegation from './StandaloneDelegation.vue';

defineOptions({ name: 'AppPluginDelegation' });
</script>

<template>
  <div class="h-full">
    <StandaloneDelegation />
  </div>
</template>
