<template>
  <span class="reader-editor" v-html="value || '--'" />
</template>

<script setup lang="ts">
defineProps<{ value?: string | null; fieldName?: string; schema?: any; data?: Record<string, any> }>()
</script>
