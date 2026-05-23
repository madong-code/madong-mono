<template>
  <span class="reader-textarea" :style="textareaStyle">
    <template v-if="value !== undefined && value !== null && value !== ''">
      <pre>{{ value }}</pre>
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
    rows?: number;
  }>(),
  {
    rows: 3,
  },
);

const lineHeight = 1.6;
const textareaStyle = computed(() => {
  const h = props.rows * lineHeight;
  return {
    minHeight: `${h}em`,
    maxHeight: `${h}em`,
  };
});
</script>

<style lang="scss" scoped>
.reader-textarea {
  display: block;
  overflow-y: auto;

  pre {
    padding: 0;
    margin: 0;
    line-height: 1.6;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .empty-value {
    line-height: 1.6;
    color: #94a3b8;
  }
}
</style>
