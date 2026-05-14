<template>
  <span class="reader-textarea" :style="textareaStyle">
    <template v-if="value !== undefined && value !== null && value !== ''">
      <pre>{{ value }}</pre>
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: string | number | null | undefined
    fieldName?: string
    schema?: any
    data?: Record<string, any>
    rows?: number
  }>(),
  {
    rows: 3,
  },
)

const lineHeight = 1.6
const textareaStyle = computed(() => {
  const h = props.rows * lineHeight
  return {
    minHeight: `${h}em`,
    maxHeight: `${h}em`,
  }
})
</script>

<style lang="scss" scoped>
.reader-textarea {
  display: block;
  overflow-y: auto;

  pre {
    margin: 0;
    padding: 0;
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.6;
  }

  .empty-value {
    color: #94a3b8;
    line-height: 1.6;
  }
}
</style>
