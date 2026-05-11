<template>
  <div class="dict-item-page art-full-height">
    <BasicCrud />
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '#/adapter/crud'
import { crudSchema } from './schemas'

const [BasicCrud] = useCrud(crudSchema())
</script>
