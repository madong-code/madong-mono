<template>
  <!-- 普通 ElSelect 同样支持 options prop(EP 2.5+)；ElSelectV2 虚拟列表在部分容器中
       高度塌陷(clientHeight=0)导致下拉选项无法渲染，故此处不使用 V2 -->
  <ElSelect v-model="value" :options="options || []">
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </ElSelect>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'
import { ElSelect } from 'element-plus'

interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

const props = defineProps<{
  modelValue?: string | undefined | number | null | Array<string | number>
  options?: Option[]
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

const slots = useSlots()

defineExpose({
  getValue() {
    return value.value
  },
})
</script>
