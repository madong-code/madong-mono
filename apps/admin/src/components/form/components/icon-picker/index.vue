<template>
  <IconPicker v-model="value" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconPicker } from '@vben/common-ui'

const props = defineProps<{
  modelValue: string | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string | undefined]
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

defineExpose({
  getValue() {
    return value.value
  },
})
</script>
