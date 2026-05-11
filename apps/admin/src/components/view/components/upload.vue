<script setup lang="ts">
import type { PropType } from 'vue'

import { ElUpload } from 'element-plus'

defineOptions({ inheritAttrs: false })

defineProps({
  value: { type: String, default: '' },
  listType: {
    type: String as PropType<'picture' | 'picture-card' | 'text'>,
    default: 'text',
  },
})
</script>

<template>
  <ElUpload
    class="m-upload-disabled"
    :disabled="true"
    :list-type="listType"
    :file-list="value ? [{ name: value, url: value }] : []"
  >
    <template #default></template>
  </ElUpload>
</template>

<style>
.m-upload-disabled .el-upload {
  display: none !important;
}
</style>
