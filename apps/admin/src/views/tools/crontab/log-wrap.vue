<template>
  <ElDrawer v-model="visible" :title="drawerTitle" size="70%">
    <CrontabLogCrud v-if="visible" :crontab-id="currentCrontabId" />
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import { ElDrawer } from 'element-plus'
import { $t } from '#/locales'
import CrontabLogCrud from './log-crud.vue'

const visible = ref(false)
const currentCrontabId = ref<number | string>('')
const currentCrontabName = ref('')

const drawerTitle = computed(() => {
  return currentCrontabName.value
    ? `【${currentCrontabName.value}】${$t('tools.crontab.log.title')}`
    : $t('tools.crontab.log.title')
})

function open(row: any) {
  currentCrontabId.value = row.id
  currentCrontabName.value = row.title
  visible.value = true
}

defineExpose({ open })
</script>
