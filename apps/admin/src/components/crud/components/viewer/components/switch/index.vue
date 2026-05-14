<template>
  <span class="reader-switch">
    <span :class="['switch-dot', { active: isActive }]">
      <span class="switch-inner">{{ isActive ? activeText : inactiveText }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: boolean | number | string | null | undefined
    fieldName?: string
    schema?: any
    data?: Record<string, any>
    activeText?: string
    inactiveText?: string
  }>(),
  {
    activeText: '是',
    inactiveText: '否',
  },
)

const isActive = computed(() => {
  if (typeof props.value === 'boolean') return props.value
  return !!props.value && String(props.value) !== '0'
})
</script>

<style lang="scss" scoped>
.reader-switch {
  display: inline-flex;
  align-items: center;
}

.switch-dot {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e2e8f0;
  color: #64748b;
  transition: all 0.3s ease;

  &.active {
    background-color: #10b981;
    color: #ffffff;
  }
}

.switch-inner {
  line-height: 16px;
}
</style>