<template>
  <ElDrawer v-model="visible" title="任务日志" size="70%" destroy-on-close>
    <Page auto-content-height>
      <BasicCrud v-if="record.id" />
    </Page>
  </ElDrawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useCrud } from '#/adapter/crud'
import { useCrudSchema } from '../crontab-log/schemas'
import { Page } from '#/components/page'
import { ElDrawer } from 'element-plus'


const visible = ref(false)
const record = ref<any>(null)
const [BasicCrud, crudApi] = useCrud(useCrudSchema())

const show = (row: any) => {
  record.value = row
  visible.value = true

  // 动态设置 beforeFetch 来传递 crontab_id
  crudApi.setState({
    beforeFetch: (params) => {
      return {
        ...params,
        crontab_id: row.id,
      };
    },
  });
}

defineExpose({ show })
</script>
