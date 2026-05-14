<template>
  <span class="reader-api-radio-group">
    <template v-if="loading">
      <span class="loading-text">加载中...</span>
    </template>
    <template v-else>{{ displayValue ?? '--' }}</template>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: string | number | null
    fieldName?: string; schema?: any; data?: Record<string, any>
    code?: string; labelField?: string; valueField?: string
  }>(),
  {
    labelField: 'label',
    valueField: 'value',
  },
)

const options = ref<any[]>([])
const loading = ref(false)

const displayValue = computed(() => {
  if (loading.value) return undefined
  if (!options.value.length || props.value == null) return undefined
  const opt = options.value.find((o: any) => o[props.valueField] == props.value)
  return opt ? opt[props.labelField] : undefined
})

const fetchDict = async () => {
  if (!props.code) return

  loading.value = true
  try {
    const dictModule = await import('#/store/modules/dict')
    const dictStore = dictModule.useDictStore()
    const data = await dictStore.getDictByType(props.code)
    options.value = data
  } catch {
    options.value = []
  } finally {
    loading.value = false
  }
}

watch(() => props.code, fetchDict, { immediate: true })
</script>

<style lang="scss" scoped>
.reader-api-radio-group {
  .loading-text {
    color: #94a3b8;
  }
}
</style>