<template>
  <span class="reader-input-number">{{ value ?? '--' }}</span>
</template>

<script setup lang="ts">
defineProps<{
  value?: number | null;
  fieldName?: string;
  schema?: any;
  data?: Record<string, any>;
}>();
</script>
