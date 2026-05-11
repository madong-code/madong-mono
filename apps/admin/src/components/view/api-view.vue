<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface OptionItem {
  label: string
  value: string | number
  children?: OptionItem[]
}

const props = withDefaults(
  defineProps<{
    value?: string | number | null | Array<string | number> | undefined
    options?: OptionItem[]
    valueField?: string
    labelField?: string
    childrenField?: string
    multiple?: boolean
  }>(),
  {
    valueField: 'id',
    labelField: 'name',
    childrenField: 'children',
  },
)

const findOption = (
  value: string | number,
  options: OptionItem[],
): OptionItem | undefined => {
  for (const option of options) {
    if (option.value === value) {
      return option
    }
    if (option.children && option.children.length > 0) {
      const found = findOption(value, option.children)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

const displayValue = computed(() => {
  if (
    !props.options ||
    !props.options.length ||
    props.value === undefined ||
    props.value === null
  ) {
    return props.value
  }
  let values = props.value
  if (props.multiple && typeof values === 'string') {
    values = values.split(',')
  }
  if (Array.isArray(values)) {
    const labels = values.map((val) => {
      const option = findOption(val, props.options!)
      return option ? option.label : val
    })
    return labels.join(', ')
  }
  const option = findOption(values, props.options)
  return option ? option.label : props.value
})
</script>
