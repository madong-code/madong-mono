<template>
  <Page auto-content-height>
    <div v-if="serverInfo" class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <ElCard shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{ $t('monitor.server.cpu.title') }}</span>
            <ElProgress :percentage="cpuUsage" :stroke-width="10" :color="progressColor(cpuUsage)" style="width: 120px" />
          </div>
        </template>
        <ElDescriptions :column="2" border size="small">
          <ElDescriptionsItem :label="$t('monitor.server.columns.key')">{{ $t('monitor.server.cpu.title') }} 使用率</ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('monitor.server.columns.value')">{{ cpuUsage }}%</ElDescriptionsItem>
          <ElDescriptionsItem label="物理核心数">{{ serverInfo.cpu?.cpuNum }}</ElDescriptionsItem>
          <ElDescriptionsItem label="逻辑核心数">{{ serverInfo.cpu?.logicalNum }}</ElDescriptionsItem>
          <ElDescriptionsItem label="缓存">{{ serverInfo.cpu?.cache }}</ElDescriptionsItem>
          <ElDescriptionsItem label="空闲率">{{ serverInfo.cpu?.free }}%</ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <ElCard shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{ $t('monitor.server.memory.title') }}</span>
            <ElProgress :percentage="memUsage" :stroke-width="10" :color="progressColor(memUsage)" style="width: 120px" />
          </div>
        </template>
        <ElDescriptions :column="2" border size="small">
          <ElDescriptionsItem label="总内存">{{ serverInfo.mem?.total }} G</ElDescriptionsItem>
          <ElDescriptionsItem label="已用内存">{{ serverInfo.mem?.used }} G</ElDescriptionsItem>
          <ElDescriptionsItem label="可用内存">{{ serverInfo.mem?.free }} G</ElDescriptionsItem>
          <ElDescriptionsItem label="使用率">{{ memUsage }}%</ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <ElCard shadow="hover" class="md:col-span-2">
        <template #header>
          <span class="font-bold">{{ $t('monitor.server.disk.title') }}</span>
        </template>
        <ElTable :data="serverInfo.disk || []" border size="small" stripe>
          <ElTableColumn :label="$t('monitor.server.columns.filesystem')" prop="filesystem" />
          <ElTableColumn :label="$t('monitor.server.columns.size')" prop="size" />
          <ElTableColumn :label="$t('monitor.server.columns.used')" prop="used" />
          <ElTableColumn :label="$t('monitor.server.columns.available')" prop="available" />
          <ElTableColumn :label="$t('monitor.server.columns.use_percentage')" prop="usePercentage">
            <template #default="{ row }">
              <ElProgress :percentage="parseFloat(row.usePercentage)" :stroke-width="8" :color="progressColor(parseFloat(row.usePercentage))" />
            </template>
          </ElTableColumn>
          <ElTableColumn :label="$t('monitor.server.columns.mounted_on')" prop="mountedOn" />
        </ElTable>
      </ElCard>

      <ElCard shadow="hover" class="md:col-span-2">
        <template #header>
          <span class="font-bold">{{ $t('monitor.server.server.title') }}</span>
        </template>
        <ElDescriptions :column="2" border size="small">
          <ElDescriptionsItem label="操作系统">{{ serverInfo.server?.os }}</ElDescriptionsItem>
          <ElDescriptionsItem label="系统架构">{{ serverInfo.server?.arch }}</ElDescriptionsItem>
          <ElDescriptionsItem label="服务器名称">{{ serverInfo.server?.hostname }}</ElDescriptionsItem>
          <ElDescriptionsItem label="系统版本">{{ serverInfo.server?.version }}</ElDescriptionsItem>
          <ElDescriptionsItem label="运行时间">{{ serverInfo.server?.uptime }}</ElDescriptionsItem>
          <ElDescriptionsItem label="系统语言">{{ serverInfo.server?.lang }}</ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>
    </div>
    <div v-else class="flex h-full items-center justify-center">
      <ElEmpty description="加载中..." />
    </div>
  </Page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { Page } from '@vben/common-ui'
import { ElCard, ElDescriptions, ElDescriptionsItem, ElProgress, ElTable, ElTableColumn, ElEmpty } from 'element-plus'
import { ServerService } from '#/api/monitor'

const serverInfo = ref<any>(null)

const cpuUsage = computed(() => {
  return parseFloat(serverInfo.value?.cpu?.usage || '0')
})

const memUsage = computed(() => {
  return parseFloat(serverInfo.value?.mem?.usage || '0')
})

function progressColor(percentage: number) {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

onMounted(async () => {
  serverInfo.value = await ServerService.list()
})
</script>
