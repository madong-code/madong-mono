<template>
  <component :is="CurrentComponent" v-model="emitValue" :options="options" v-bind="attrs" />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, useAttrs } from 'vue'
import CheckboxGroup from '../checkbox-group/index.vue'
import RadioGroup from '../radio-group/index.vue'
import Select from '../select/index.vue'

interface DictOption {
  label: string
  modelValue: string | number
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | Array<string | number>
    code: string
    renderType?: 'Select' | 'RadioGroup' | 'CheckboxGroup'
  }>(),
  {
    modelValue: '',
    renderType: 'Select',
  },
)

const emit = defineEmits<{
  'update:modelValue': [modelValue: any]
}>()

const attrs = useAttrs()

const componentMap: Record<string, any> = {
  Select,
  RadioGroup,
  CheckboxGroup,
}

const CurrentComponent = computed(() => componentMap[props.renderType || 'Select'])

const emitValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const options = ref<DictOption[]>([])

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
