<template>
  <div class="read-divider" :class="{ 'read-divider--with-title': !!title }">
    <h4 v-if="title" class="read-divider__title">{{ title }}</h4>
    <div class="read-divider__line" />
  </div>
</template>

<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

defineProps<{
  value?: any;
  fieldName?: string;
  schema?: VbenFormSchema;
  data?: Record<string, any>;
  /** 分割线标题，通过 schema.componentProps.title 传入 */
  title?: string;
}>();
</script>

<style scoped>
.read-divider {
  width: 100%;
  padding: 8px 6px;
  margin: 0 -6px;
  background: var(--el-bg-color, #fff) !important;
}

.read-divider--with-title {
  padding: 16px 0 8px;
}

.read-divider__title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary, #303133);
  line-height: 1.4;
  background: none !important;
}

.read-divider__line {
  height: 1px;
  background: linear-gradient(
    to right,
    var(--el-border-color, #dcdfe6) 0%,
    var(--el-border-color-light, #e4e7ed) 40%,
    transparent 100%
  );
}
</style>
