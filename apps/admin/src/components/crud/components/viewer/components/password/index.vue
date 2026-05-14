<template>
  <span class="reader-password">{{ value ? '******' : '--' }}</span>
</template>

<script setup lang="ts">
defineProps<{ value?: string | null; fieldName?: string; schema?: any; data?: Record<string, any> }>()
</script>
