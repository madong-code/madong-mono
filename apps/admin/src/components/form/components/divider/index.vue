<template>
  <div class="divider">
    <span class="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)
</script>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
  font-size: 14px;
  padding: 0 16px;
  box-sizing: border-box;
}

.divider .title {
  color: var(--el-text-color-regular);
  font-size: 15px;
  font-weight: 600;
}
</style>
