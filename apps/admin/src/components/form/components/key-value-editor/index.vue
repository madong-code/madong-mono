<template>
  <div class="key-value-editor">
    <div v-for="(item, index) in list" :key="index" class="key-value-row">
      <el-input v-model="item.key" placeholder="键" class="key-input" @change="handleChange" />
      <span class="separator">:</span>
      <el-input v-model="item.val" placeholder="值" class="value-input" @change="handleChange" />
      <el-button type="danger" link class="delete-btn" @click="removeRow(index)">
        <Icon icon="lucide:trash-2" />
      </el-button>
    </div>
    <el-button type="primary" link class="add-btn" @click="addRow">
      <Icon icon="lucide:plus" />
      <span>添加</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '#/components/icon'

interface KeyValueItem {
  key: string
  val: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: Record<string, any>
  }>(),
  { modelValue: () => ({}) },
)

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const objectToList = (obj: Record<string, any> | undefined): KeyValueItem[] => {
  if (!obj || typeof obj !== 'object') return []
  return Object.entries(obj).map(([key, v]) => ({
    key,
    val: typeof v === 'object' ? JSON.stringify(v) : String(v),
  }))
}

const listToObject = (list: KeyValueItem[]): Record<string, any> => {
  const result: Record<string, any> = {}
  list.forEach((item) => {
    if (item.key.trim()) {
      try {
        result[item.key] = JSON.parse(item.val)
      } catch {
        result[item.key] = item.val
      }
    }
  })
  return result
}

const list = ref<KeyValueItem[]>([])

watch(
  () => props.modelValue,
  (newVal) => {
    list.value = objectToList(newVal)
  },
  { deep: true, immediate: true },
)

const addRow = () => {
  list.value.push({ key: '', val: '' })
}

const removeRow = (index: number) => {
  list.value.splice(index, 1)
  handleChange()
}

const handleChange = () => {
  const result = listToObject(list.value)
  emit('update:modelValue', result)
}

defineExpose({
  getValue() {
    return listToObject(list.value)
  },
})
</script>

<style scoped>
.key-value-editor {
  width: 100%;
}

.key-value-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.key-input {
  flex: 0 0 35%;
}

.separator {
  color: #909399;
  font-weight: bold;
}

.value-input {
  flex: 1;
}

.delete-btn {
  flex-shrink: 0;
  padding: 4px;
}

.add-btn {
  margin-top: 4px;
}
</style>
