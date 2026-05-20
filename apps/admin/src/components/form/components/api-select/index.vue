<template>
  <ApiComponent v-model="value" model-prop-name="modelValue" :component="Select" />
</template>

<script setup lang="ts">
import ApiComponent from '../api-component/index.vue'
import Select from '../select/index.vue'

const props = defineProps<{
  modelValue?: string | undefined | number | null | Array<string | number>
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string | undefined | number | null | Array<string | number>]
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

import { computed } from 'vue'

defineExpose({
  getValue() {
    return value.value
  },
})
</script>
