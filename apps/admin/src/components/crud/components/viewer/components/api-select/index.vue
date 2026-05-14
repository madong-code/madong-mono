<template>
  <span class="reader-api-select">{{ displayValue ?? value ?? '--' }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps<{
  value?: string | number | null
  fieldName?: string; schema?: any; data?: Record<string, any>
  code?: string; labelField?: string; valueField?: string
}>()

const options = ref<any[]>([])
const labelField = computed(() => props.labelField || 'label')
const valueField = computed(() => props.valueField || 'value')

const displayValue = computed(() => {
  if (!options.value.length || props.value == null) return null
  const opt = options.value.find((o: any) => o[valueField.value] == props.value)
  return opt ? opt[labelField.value] : null
})

const fetchData = async () => {
  if (!props.code) return
  try {
    const { useDictStore } = await import('@vben/stores')
    const store = useDictStore()
    const list = await store.getDict(props.code)
    options.value = Array.isArray(list) ? list : []
  } catch { options.value = [] }
}

watch(() => props.code, fetchData)
onMounted(fetchData)
</script>

<style lang="scss" scoped>
.reader-api-select { color: inherit; }
</style>
