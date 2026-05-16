<template>
  <el-drawer v-model="visible" title="任务日志" size="70%" destroy-on-close>
    <Page auto-content-height>
      <BasicCrud />
    </Page>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCrud } from '#/adapter/crud'
import { crudSchema } from '../../crontab-log/schemas'
import { Page } from '#/components/page'

const visible = ref(false)
const [BasicCrud] = useCrud(crudSchema)

const show = (record: any) => {
  visible.value = true
}

defineExpose({ show })
</script>
