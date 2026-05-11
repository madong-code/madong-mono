<script setup lang="ts">
import { ElImage } from 'element-plus'

defineOptions({ name: 'AvatarView', inheritAttrs: false })

defineProps({
  value: { type: String, default: '' },
})
</script>

<template>
  <ElImage v-if="value" :preview-src-list="[value]" :src="value" style="width: 102px" />
</template>
