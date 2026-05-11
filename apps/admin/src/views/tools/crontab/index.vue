<template>
  <div class="crontab-page art-full-height">
    <BasicCrud />
    <CrontabLogDrawer ref="logDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useCrud } from '#/adapter/crud'
import { crudSchema, crontabLogDrawerOpener } from './schemas'
import CrontabLogDrawer from './log-wrap.vue'

const [BasicCrud] = useCrud(crudSchema())

const logDrawerRef = ref<any>(null)

crontabLogDrawerOpener.open = (row: any) => {
  logDrawerRef.value?.open(row)
}
</script>
