<template>
  <div class="m-editor">
    <ElInput
      v-model="content"
      type="textarea"
      :rows="8"
      placeholder="请输入内容"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElInput } from 'element-plus'

const props = withDefaults(
  defineProps<{
    value?: string
  }>(),
  {
    value: '',
  },
)

const emit = defineEmits<{
  'update:value': [value: string]
}>()

const content = computed({
  get: () => props.value,
  set: (val: string) => emit('update:value', val),
})
</script>
