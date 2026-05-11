<template>
  <Page auto-content-height>
    <div v-if="redisData" class="flex flex-col gap-4 p-4">
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <ElCard shadow="hover" class="text-center">
          <ElStatistic :title="$t('monitor.redis.uptime')" :value="redisData.info?.uptime_in_days || 0" suffix="天" />
        </ElCard>
        <ElCard shadow="hover" class="text-center">
          <ElStatistic :title="$t('monitor.redis.connected_clients')" :value="redisData.info?.connected_clients || 0" />
        </ElCard>
        <ElCard shadow="hover" class="text-center">
          <ElStatistic :title="$t('monitor.redis.used_memory')" :value="redisData.info?.used_memory_human || '0B'" />
        </ElCard>
        <ElCard shadow="hover" class="text-center">
          <ElStatistic :title="$t('monitor.redis.ops_per_sec')" :value="redisData.info?.instantaneous_ops_per_sec || 0" />
        </ElCard>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ElCard shadow="hover">
          <template #header>
            <span class="font-bold">{{ $t('monitor.redis.memory_analysis') }}</span>
          </template>
          <ElDescriptions :column="1" border size="small">
            <ElDescriptionsItem :label="$t('monitor.redis.used_memory')">{{ redisData.info?.used_memory_human }}</ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('monitor.redis.used_memory_peak')">{{ redisData.info?.used_memory_peak_human }}</ElDescriptionsItem>
            <ElDescriptionsItem label="total_system_memory">{{ redisData.info?.total_system_memory_human }}</ElDescriptionsItem>
            <ElDescriptionsItem label="mem_fragmentation_ratio">{{ redisData.info?.mem_fragmentation_ratio }}</ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>

        <ElCard shadow="hover">
          <template #header>
            <span class="font-bold">{{ $t('monitor.redis.cache_efficiency') }}</span>
          </template>
          <ElDescriptions :column="1" border size="small">
            <ElDescriptionsItem label="keyspace_hits">{{ redisData.info?.keyspace_hits }}</ElDescriptionsItem>
            <ElDescriptionsItem label="keyspace_misses">{{ redisData.info?.keyspace_misses }}</ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('monitor.redis.hit_rate')">{{ hitRate }}%</ElDescriptionsItem>
            <ElDescriptionsItem label="expired_keys">{{ redisData.info?.expired_keys }}</ElDescriptionsItem>
          </ElDescriptions>
        </ElCard>
      </div>

      <ElCard shadow="hover">
        <template #header>
          <span class="font-bold">{{ $t('monitor.redis.db_size') }}</span>
        </template>
        <ElDescriptions :column="3" border size="small">
          <ElDescriptionsItem v-for="(value, key) in (redisData.dbSize || {})" :key="key" :label="String(key)">
            {{ value }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <ElCard shadow="hover">
        <template #header>
          <span class="font-bold">{{ $t('monitor.redis.command_stats') }}</span>
          <ElButton class="float-right" size="small" @click="refreshData">刷新</ElButton>
        </template>
        <ElTable :data="commandStatsList" border size="small" stripe max-height="400">
          <ElTableColumn label="命令" prop="name" />
          <ElTableColumn label="执行次数" prop="value" />
        </ElTable>
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
import { ElCard, ElDescriptions, ElDescriptionsItem, ElStatistic, ElTable, ElTableColumn, ElEmpty, ElButton } from 'element-plus'
import { RedisService } from '#/api/monitor'

const redisData = ref<any>(null)

const hitRate = computed(() => {
  const hits = parseFloat(redisData.value?.info?.keyspace_hits || '0')
  const misses = parseFloat(redisData.value?.info?.keyspace_misses || '0')
  const total = hits + misses
  return total === 0 ? '0.00' : ((hits / total) * 100).toFixed(2)
})

const commandStatsList = computed(() => {
  const stats = redisData.value?.commandStats || []
  return stats.map((item: any) => ({
    name: item.name || item.command,
    value: item.value || item.calls,
  }))
})

async function refreshData() {
  redisData.value = await RedisService.list()
}

onMounted(() => {
  refreshData()
})
</script>
