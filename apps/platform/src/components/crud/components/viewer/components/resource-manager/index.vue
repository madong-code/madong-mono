<template>
  <span class="reader-resource">{{ displayValue ?? '--' }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value?: string | string[] | null;
  fieldName?: string;
  schema?: any;
  data?: Record<string, any>;
}>();

const displayValue = computed(() => {
  if (!props.value) return null;
  if (Array.isArray(props.value)) return props.value.join(', ');
  return props.value;
});
</script>
