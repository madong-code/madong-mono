<template>
  <span>{{ mValue }}</span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  value: { type: Object as PropType<any> },
  record: { type: Object },
  separator: { type: String, default: ' ~ ' },
})

const mValue = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value.join(props.separator)
  }
  return props.value
})
</script>
