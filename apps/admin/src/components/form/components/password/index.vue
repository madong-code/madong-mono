<template>
  <ElInput v-model="value" type="password" show-password v-bind="$attrs">
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ElInput>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { ElInput } from 'element-plus'

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

const slots = useSlots()

defineExpose({
  getValue() {
    return value.value
  },
})
</script>
