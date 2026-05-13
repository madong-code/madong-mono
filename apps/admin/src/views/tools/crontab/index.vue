<template>
  <Page auto-content-height>
    <BasicCrud />
    <CrontabLogDrawer ref="logDrawerRef" />
  </Page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Page } from '@vben/common-ui'

import { useCrud } from '#/adapter/crud'
import { crudSchema, crontabLogDrawerOpener } from './schemas'
import CrontabLogDrawer from './log-wrap.vue'

const [BasicCrud] = useCrud(crudSchema)

const logDrawerRef = ref<any>(null)

crontabLogDrawerOpener.open = (row: any) => {
  logDrawerRef.value?.open(row)
}
</script>
