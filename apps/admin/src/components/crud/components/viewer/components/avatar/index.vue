<template>
  <ElAvatar
    v-if="isShow"
    :src="value"
    :size="size"
    :shape="shape"
  />
  <span v-else class="empty-value">--</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElAvatar } from 'element-plus'

const props = withDefaults(
  defineProps<{
    value?: string | null | undefined
    fieldName?: string
    schema?: any
    data?: Record<string, any>
    size?: number
    shape?: 'circle' | 'square'
  }>(),
  {
    size: 102,
    shape: 'square',
  },
)

const isShow = computed(() => props.value !== undefined && props.value !== null && props.value !== '')
</script>

<style lang="scss" scoped>
:deep(.el-avatar) {
  margin: -6px;
  background: transparent !important;
}
</style>

<!-- 覆盖外层 detail-view-value 的背景色 -->
<style>
.detail-view-value:has(.el-avatar) {
  background-color: transparent !important;
}
</style>
