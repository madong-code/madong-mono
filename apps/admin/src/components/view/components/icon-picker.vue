<template>
  <IconifyIcon :icon="value" />
</template>

<script setup lang="ts">
import { IconifyIcon } from '@vben/icons'

defineOptions({ inheritAttrs: false })

defineProps({
  value: { type: String, default: '' },
  record: { type: Object },
})
</script>
