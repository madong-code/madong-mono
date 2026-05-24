<template>
  <div class="reader-kv">
    <template v-if="entries.length">
      <div v-for="(e, i) in entries" :key="i" class="kv-row">
        {{ e.key }}: {{ e.val }}
      </div>
    </template>
    <span v-else class="empty-value">--</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value?: Record<string, any> | null;
  fieldName?: string;
  schema?: any;
  data?: Record<string, any>;
}>();

const entries = computed(() => {
  if (!props.value || typeof props.value !== 'object') return [];
  return Object.entries(props.value).map(([key, val]) => ({
    key,
    val: String(val),
  }));
});
</script>

<style lang="scss" scoped>
.kv-row {
  line-height: 1.6;
}

.empty-value {
  color: #94a3b8;
}
</style>
