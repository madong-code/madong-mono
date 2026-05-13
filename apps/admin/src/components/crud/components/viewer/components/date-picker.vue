<template>
  <span class="reader-date-picker">
    <template v-if="value !== undefined && value !== null">
      {{ formattedValue }}
    </template>
    <span v-else class="empty-value">--</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: string | number | Date | null | undefined
    fieldName?: string
    schema?: any
    data?: Record<string, any>
    format?: string
    type?: string
  }>(),
  {
    format: 'YYYY-MM-DD HH:mm:ss',
    type: 'date',
  },
)

const formattedValue = computed(() => {
  if (!props.value) return ''
  
  let date: Date
  if (typeof props.value === 'number') {
    date = new Date(props.value)
  } else if (typeof props.value === 'string') {
    date = new Date(props.value)
  } else {
    date = props.value
  }
  
  if (isNaN(date.getTime())) {
    return props.value as string
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return props.format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
})
</script>

<style lang="scss" scoped>
.reader-date-picker {
  .empty-value {
    color: #94a3b8;
  }
}
</style>
