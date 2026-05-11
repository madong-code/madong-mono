<template>
  <ElDrawer v-model="visible" :title="drawerTitle" size="60%">
    <DictItemCrud v-if="visible" :dict-id="currentDictId" :dict-code="currentDictCode" />
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { ElDrawer } from 'element-plus'
import { $t } from '#/locales'
import DictItemCrud from './dict-item-crud.vue'

const visible = ref(false)
const currentDictId = ref<number | string>('')
const currentDictCode = ref('')
const currentDictName = ref('')

const drawerTitle = computed(() => {
  return currentDictName.value
    ? `【${currentDictName.value}】${$t('setting.dict.item.title')}`
    : $t('setting.dict.item.title')
})

function open(row: any) {
  currentDictId.value = row.id
  currentDictCode.value = row.code
  currentDictName.value = row.name
  visible.value = true
}

defineExpose({ open })
</script>
