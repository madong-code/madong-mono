<template>
  <ApiComponent v-model="value" model-prop-name="value" :component="RadioGroup" />
</template>

<script setup lang="ts">
import ApiComponent from '../api-component/index.vue'
import RadioGroup from '../radio-group/index.vue'

const props = defineProps<{
  modelValue?: string | number | boolean | undefined
  isBtn?: boolean
  size?: 'default' | 'small' | 'large' | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string | number | boolean | undefined]
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
