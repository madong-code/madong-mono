<template>
  <Page auto-content-height>
    <BasicCrud />
  </Page>
</template>

<script setup lang="ts">
import { useCrud } from '#/adapter/crud'
import { useCrudSchema } from './schemas'

const [BasicCrud] = useCrud(useCrudSchema())
</script>
