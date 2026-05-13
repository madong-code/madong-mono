<template>
  <Page auto-content-height>
    <div class="crontab-log-crud">
      <BasicCrud />
    </div>
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@vben/common-ui'

import { useCrud } from '#/adapter/crud'
import type { CrudSchema } from '#/adapter/crud'
import { CrontabLogService } from '#/api/tools'
import { $t } from '#/locales'

const props = defineProps<{
  crontabId: number | string
}>()

const crudSchemaDef = (): CrudSchema => {
  return {
    crudApi: {
      list: CrontabLogService.list,
    },
    table: {
      hasAdd: false,
      hasEdit: false,
      hasView: false,
      hasRemove: false,
      columns: [
        { field: 'id', title: 'ID', minWidth: 60 },
        { field: 'crontab_id', title: $t('tools.crontab.log.table.columns.crontab_id'), minWidth: 80 },
        { field: 'name', title: $t('tools.crontab.log.table.columns.name'), minWidth: 120 },
        { field: 'target', title: $t('tools.crontab.log.table.columns.target'), minWidth: 150 },
        { field: 'status', title: $t('tools.crontab.log.table.columns.status'), minWidth: 80 },
        { field: 'result', title: $t('tools.crontab.log.table.columns.result'), minWidth: 200 },
        { field: 'exception_message', title: $t('tools.crontab.log.table.columns.exception_message'), minWidth: 200 },
        { field: 'created_at', title: $t('tools.crontab.log.table.columns.created_at'), minWidth: 160 },
      ],
      beforeFetch: (params: any) => {
        params.EQ_crontab_id = props.crontabId
        return params
      },
    },
  }
}

const [BasicCrud] = useCrud(crudSchemaDef())
</script>
