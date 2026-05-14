<template>
  <ApiComponent v-model="value" :component="CheckboxGroup" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ApiComponent from '../api-component/index.vue'
import CheckboxGroup from '../checkbox-group/index.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string | number>
    isBtn?: boolean
    size?: 'default' | 'small' | 'large'
  }>(),
  { modelValue: () => [], isBtn: false },
)

const emit = defineEmits<{
  'update:modelValue': [modelValue: Array<string | number> | undefined]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

defineExpose({ getValue: () => value.value })
</script>
