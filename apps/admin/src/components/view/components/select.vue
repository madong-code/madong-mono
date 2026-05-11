<template>
  <span>{{ cValue }}</span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

interface NewOption {
  label: string
  value: string | number
}

const props = defineProps({
  value: { type: [String, Number, Array] as PropType<string | number | (string | number)[]> },
  record: { type: Object },
  options: { type: Array as PropType<NewOption[]>, default: () => [] },
})

const cValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return ''
  }
  if (Array.isArray(props.value)) {
    return props.value
      .map((val: string | number) => {
        const option = props.options.find((opt: NewOption) => opt.value === val)
        return option ? option.label : val
      })
      .join(', ')
  }
  const option = props.options.find((opt: NewOption) => opt.value === props.value)
  return option ? option.label : props.value
})
</script>
