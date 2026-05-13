<template>
  <Page auto-content-height>
    <BasicCrud />
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@vben/common-ui'

import { useCrud } from '#/adapter/crud'
import { crudSchema } from './schemas'

const [BasicCrud] = useCrud(crudSchema)
</script>
