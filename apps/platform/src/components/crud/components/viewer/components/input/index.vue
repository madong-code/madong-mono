<template>
  <span :class="['reader-input', { 'reader-input-multiline': isMultiline }]">
    <template v-if="value !== undefined && value !== null">
      <template v-if="isMultiline">
        <pre>{{ value }}</pre>
      </template>
      <template v-else>
        {{ value }}
      </template>
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: string | number | null | undefined;
    fieldName?: string;
    schema?: any;
    data?: Record<string, any>;
    type?: string;
    rows?: number;
  }>(),
  {
    type: 'text',
    rows: 1,
  },
);

const isMultiline = computed(() => {
  return props.type === 'textarea' || props.rows > 1;
});
</script>

<style lang="scss" scoped>
.reader-input {
  display: inline-block;

  &-multiline {
    pre {
      margin: 0;
      line-height: 1.6;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }

  .empty-value {
    color: #94a3b8;
  }
}
</style>
