<template>
  <ElSwitch v-bind="$attrs" />
</template>

<script setup lang="ts">
/**
 * 表单 Switch 组件（供 useVbenForm schema `component: 'Switch'` 使用）
 * 由 component-map 自动扫描注册；模型绑定沿用 ElSwitch 的 v-model。
 */
import { ElSwitch } from 'element-plus';

defineOptions({
  name: 'Switch',
  inheritAttrs: false,
});
</script>
