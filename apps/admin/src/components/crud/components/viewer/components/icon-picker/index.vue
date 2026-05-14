<template>
  <span class="reader-icon-picker">
    <Icon v-if="value" :icon="value" />
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { Icon } from '#/components/icon'

defineProps<{ value?: string | null; fieldName?: string; schema?: any; data?: Record<string, any> }>()
</script>

<style lang="scss" scoped>
.empty-value { color: #94a3b8; }
</style>
