<template>
  <ElSelect v-if="renderType === 'Select'" v-bind="$attrs" v-model="modelValue" @update:model-value="emit('update:value', $event)">
    <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </ElSelect>
  <ElRadioGroup v-else-if="renderType === 'RadioGroup'" v-bind="$attrs" :model-value="value as string | number | undefined" @update:model-value="emit('update:value', $event)">
    <ElRadio v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</ElRadio>
  </ElRadioGroup>
  <ElCheckboxGroup v-else-if="renderType === 'CheckboxGroup'" v-bind="$attrs" :model-value="checkboxValue" @update:model-value="emit('update:value', $event)">
    <ElCheckbox v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </ElCheckboxGroup>
  <ElSelect v-else v-bind="$attrs" v-model="modelValue" @update:model-value="emit('update:value', $event)">
    <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </ElSelect>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { ElCheckbox, ElCheckboxGroup, ElOption, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'

interface NewOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    value?: string | number | Array<string | number>
    code: string
    renderType?: 'Select' | 'RadioGroup' | 'CheckboxGroup'
  }>(),
  {
    value: '',
    renderType: 'Select',
  },
)

const emit = defineEmits<{
  'update:value': [value: any]
}>()

const modelValue = computed({
  get: () => props.value as string | number,
  set: (val) => emit('update:value', val),
})

const checkboxValue = computed({
  get: () => (Array.isArray(props.value) ? props.value : []) as (string | number)[],
  set: (val) => emit('update:value', val),
})

const options = ref<NewOption[]>([])

onBeforeMount(async () => {
  if (!props.code) return
  try {
    const dictModule = await import('#/store/modules/dict')
    const dictStore = dictModule.useDictStore()
    const data = await dictStore.getDictByType(props.code)
    options.value = data
  } catch (error) {
    console.error('获取字典数据失败:', error)
    options.value = []
  }
})
</script>
