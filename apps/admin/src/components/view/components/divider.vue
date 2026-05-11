<template>
  <el-divider>{{ title }}</el-divider>
</template>

<script lang="ts" setup>
defineOptions({ inheritAttrs: false })

defineProps({
  title: { type: String, default: '' },
})
</script>
