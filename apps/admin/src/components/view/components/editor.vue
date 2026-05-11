<template>
  <div v-html="value" class="m-editor-html"></div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps({
  value: { type: String },
  record: { type: Object },
})
</script>
