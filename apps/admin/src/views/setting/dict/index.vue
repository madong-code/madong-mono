<template>
  <Page auto-content-height>
    <BasicCrud />
    <DictItemDrawer ref="dictItemDrawerRef" />
  </Page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { Page } from '@vben/common-ui'

import { useCrud } from '#/adapter/crud'
import { crudSchema, dictItemDrawerOpener } from './schemas'
import DictItemDrawer from './dict-item-wrap.vue'

const [BasicCrud] = useCrud(crudSchema)

const dictItemDrawerRef = ref<any>(null)

dictItemDrawerOpener.open = (row: any) => {
  dictItemDrawerRef.value?.open(row)
}
</script>
