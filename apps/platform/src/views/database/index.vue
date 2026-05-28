<template>
  <Page auto-content-height>
    <BasicCrud />
  </Page>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';

import { useCrud } from '#/adapter/crud'
import { useCrudSchema } from './schemas'
import { DbSettingService } from '#/api/database'

const handleTestConnection = async (row: any) => {
  try {
    const res = await DbSettingService.testConnection(row.id)
    const data = res?.data ?? res
    if (data?.success) {
      ElMessage.success(`连接成功：${data.message || ''}`)
    } else {
      ElMessage.error(`连接失败：${data?.message || '未知错误'}`)
    }
  } catch (e: any) {
    ElMessage.error(e?.message || '测试连接失败')
  }
}

const [BasicCrud] = useCrud({
  ...useCrudSchema(),
   dropDownActions: [
    {
      label: '测试连接',
      type: 'primary',
      link: true,
      auth: 'database:test',
      icon: 'ant-design:sync-outlined',
      onClick: (_e: any, row: any) => handleTestConnection(row),
    },
  ],
  })

</script>
