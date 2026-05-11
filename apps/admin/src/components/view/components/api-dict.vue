<template>
  <template v-if="isTag">
    <el-space v-if="cNewOptions.length">
      <template v-for="item in cNewOptions" :key="item.value">
        <el-tag
          :size="size"
          :hit="hit"
          :effect="effect"
          v-if="item.tagProps"
          v-bind="item.tagProps"
        >{{ item.label }}</el-tag>
        <span v-else>{{ item.label }}</span>
      </template>
    </el-space>
  </template>
  <el-switch
    v-loading="switchLoading"
    v-model="switchValue"
    @change="handleChange"
    v-else-if="props.switch?.enabled === true"
  ></el-switch>
  <span v-else>{{ cValue }}</span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import { computed, onBeforeMount, ref } from 'vue'

interface ColorType {
  textColor?: string
  bgColor?: string
}

interface NewOption {
  label: string
  value: string | number
  bgColor?: string
  textColor?: string
  children?: NewOption[]
}

type SwitchType = {
  enabled: boolean
  api?: (flag: boolean, record: any) => Promise<any>
  permCode?: string
}

defineOptions({ name: 'ApiDictView', inheritAttrs: false })

const props = defineProps({
  value: { type: [String, Number, Array] },
  record: { type: Object },
  code: { type: String },
  hit: { type: Boolean, default: false },
  size: { type: String as PropType<'' | 'small' | 'default' | 'large'>, default: 'small' },
  typeMap: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  colorMap: { type: Object as PropType<Record<string | number, ColorType>>, default: () => ({}) },
  colorList: {
    type: Array as PropType<ColorType[]>,
    default: () => [
      { textColor: '#13deb9', bgColor: '#E7FCF8' },
      { textColor: '#1890ff', bgColor: '#E6F7FF' },
      { textColor: '#52c41a', bgColor: '#F6FFED' },
      { textColor: '#faad14', bgColor: '#FFFBE6' },
      { textColor: '#722ed1', bgColor: '#F9F0FF' },
      { textColor: '#f5222d', bgColor: '#FFF1F0' },
      { textColor: '#909399', bgColor: '#F4F4F5' },
    ],
  },
  useColorList: { type: Boolean, default: true },
  switch: { type: Object as PropType<SwitchType>, default: () => ({}) },
})

const emits = defineEmits(['switch-change'])
const switchValue = ref(props.value === 1 || props.value === '1')
const switchLoading = ref(false)
const options = ref<NewOption[]>([])

const effect = computed<'dark' | 'light' | 'plain'>(() => 'light')

const isTag = computed(() => {
  if (props.switch?.enabled === true) {
    return false
  }
  return (
    Object.keys(props.typeMap).length > 0 ||
    Object.keys(props.colorMap).length > 0 ||
    props.useColorList
  )
})

type NewOptionType = NewOption & { tagProps?: any }

const cValue = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value
      .map((val) => {
        const option = options.value.find((opt: any) => opt.value === val)
        return option ? option.label : val
      })
      .join(', ')
  } else {
    const option = options.value.find((opt: any) => opt.value === props.value)
    return option ? option.label : props.value
  }
})

const createTagOption = (
  option: NewOption | null,
  value: string | number,
  index: number,
): NewOptionType => {
  if (!option) {
    return { label: String(value), value }
  }
  const colorMapConfig = props.colorMap[option.value]
  const colorListConfig =
    props.useColorList && props.colorList.length > 0
      ? props.colorList[index % props.colorList.length]
      : undefined
  const colorConfig = colorMapConfig || colorListConfig
  const bgColor = option.bgColor || colorConfig?.bgColor
  const textColor = option.textColor || colorConfig?.textColor
  return {
    ...option,
    tagProps: {
      type: props.typeMap[option.value],
      color: bgColor,
      style: { color: textColor },
    },
  }
}

const cNewOptions = computed<NewOptionType[]>(() => {
  if (Array.isArray(props.value)) {
    return props.value.map((val: any) => {
      const option = options.value.find((opt: any) => opt.value === val) ?? null
      const optionIndex = option ? options.value.indexOf(option) : 0
      return createTagOption(option, val, optionIndex)
    })
  } else {
    if (props.value === undefined || props.value === null) {
      return []
    }
    const option = options.value.find((opt: any) => opt.value === props.value)
    const optionIndex = option ? options.value.indexOf(option) : 0
    return option
      ? [createTagOption(option, props.value, optionIndex)]
      : [{ label: String(props.value), value: props.value as string | number }]
  }
})

onBeforeMount(() => {
  requestData()
})

const requestData = async () => {
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
}

const handleChange = (value: any) => {
  if (props.switch?.api) {
    switchLoading.value = true
    props.switch
      .api(value, props.record)
      .then(() => {
        emits('switch-change', value)
      })
      .finally(() => {
        switchLoading.value = false
      })
  } else {
    emits('switch-change', value)
  }
}
</script>
