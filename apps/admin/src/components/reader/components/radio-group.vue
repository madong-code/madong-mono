<template>
  <span class="reader-radio-group">
    <template v-if="displayLabel !== undefined">
      {{ displayLabel }}
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
    options?: {
      label: string
      value: string | number
    }[]
  }>(),
  {},
)

const displayLabel = computed(() => {
  if (!props.options || !props.options.length) {
    return props.value
  }
  if (props.value === undefined || props.value === null) {
    return undefined
  }
  const option = props.options.find((opt) => opt.value === props.value)
  return option ? option.label : props.value
})
</script>

<style lang="scss" scoped>
.reader-radio-group {
  .empty-value {
    color: #94a3b8;
  }
}
</style>
