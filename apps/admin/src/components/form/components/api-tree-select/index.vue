<template>
  <ApiComponent
    v-model="value"
    :component="ElTreeSelect"
    options-prop-name="data"
    :value-field="valueField"
    :label-field="labelField"
    :children-field="childrenField"
    :teleported="$attrs.teleported ?? false"
  />
</template>

<script setup lang="ts">
import ApiComponent from '../api-component/index.vue'
import { computed } from 'vue'
import { ElTreeSelect } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue?: string | undefined | number | null | Array<string | number>
    valueField?: string
    labelField?: string
    childrenField?: string
  }>(),
  {
    valueField: 'id',
    labelField: 'name',
    childrenField: 'children',
  },
)

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

defineExpose({
  getValue() {
    return value.value
  },
})
</script>
