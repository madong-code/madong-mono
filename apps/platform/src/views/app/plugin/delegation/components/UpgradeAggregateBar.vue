<script setup lang="ts">
/** WP9 升级统计聚合卡片 (UpgradeAggregateBar)
 *  - 顶部一行 4 张数字卡: 平台已装/已升级/可升级/未授权
 *  - 下方表格 + 批量升级按钮
 */
import { computed, onMounted, ref } from 'vue';

import {
  ElButton,
  ElCard,
  ElIcon,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import { Package, Rocket, Sparkles, Wand2 } from 'lucide-vue-next';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { $t } from '#/locales';

import BatchUpgradeDialog from './BatchUpgradeDialog.vue';
import OccupyingTenantDialog from './OccupyingTenantDialog.vue';

defineOptions({ name: 'UpgradeAggregateBar' });

const loading = ref(false);
const stats = ref<Array<{ plugin_key: string; latest_version: string; installed_count: number; upgradable_count: number; ungranted_count: number }>>([]);

const totals = computed(() => {
  return {
    installed: stats.value.reduce((a, c) => a + c.installed_count, 0),
    upgradable: stats.value.reduce((a, c) => a + c.upgradable_count, 0),
    ungranted: stats.value.reduce((a, c) => a + c.ungranted_count, 0),
  };
});

const plugins = computed(() => stats.value.length);

// 批量弹框
const batchDialogRef = ref();
const selectedPluginKey = ref<string | null>(null);
const selectedPluginVersion = ref<string | null>(null);

const openBatchDialog = (row: any) => {
  selectedPluginKey.value = row.plugin_key;
  selectedPluginVersion.value = row.latest_version;
  batchDialogRef.value?.open();
};

// 占用清单
const occupyingDialogRef = ref();
const openOccupying = (row: any) => {
  occupyingDialogRef.value?.open(row.plugin_key);
};

const refresh = async () => {
  loading.value = true;
  try {
    const res = await AppPluginDelegationService.getStats();
    stats.value = res.items;
  } catch {
    stats.value = [];
  } finally {
    loading.value = false;
  }
};

defineExpose({ refresh });

onMounted(refresh);
</script>

<template>
  <div class="upgrade-aggregate" v-loading="loading">
    <!-- 顶部 4 个聚合卡 -->
    <div class="aggregate-row">
      <ElCard shadow="never" class="aggregate-card">
        <div class="card-icon" style="background: #ecf5ff; color: #409eff;">
          <ElIcon :size="20"><Package /></ElIcon>
        </div>
        <div class="card-body">
          <div class="card-label">{{ $t('app.plugin.distribution.stat.platform_installed') }}</div>
          <div class="card-value">{{ plugins }}</div>
        </div>
      </ElCard>

      <ElCard shadow="never" class="aggregate-card">
        <div class="card-icon" style="background: #f0f9eb; color: #67c23a;">
          <ElIcon :size="20"><Sparkles /></ElIcon>
        </div>
        <div class="card-body">
          <div class="card-label">{{ $t('app.plugin.distribution.stat.up_to_date') }}</div>
          <div class="card-value">{{ totals.installed - totals.upgradable }}</div>
        </div>
      </ElCard>

      <ElCard shadow="never" class="aggregate-card">
        <div class="card-icon" style="background: #fdf6ec; color: #e6a23c;">
          <ElIcon :size="20"><Rocket /></ElIcon>
        </div>
        <div class="card-body">
          <div class="card-label">{{ $t('app.plugin.distribution.stat.upgradable') }}</div>
          <div class="card-value">{{ totals.upgradable }}</div>
        </div>
      </ElCard>

      <ElCard shadow="never" class="aggregate-card">
        <div class="card-icon" style="background: #fef0f0; color: #f56c6c;">
          <ElIcon :size="20"><Wand2 /></ElIcon>
        </div>
        <div class="card-body">
          <div class="card-label">{{ $t('app.plugin.distribution.stat.ungranted') }}</div>
          <div class="card-value">{{ totals.ungranted }}</div>
        </div>
      </ElCard>
    </div>

    <!-- 升级统计表 -->
    <ElCard shadow="never" class="rounded-xl mt-4">
      <template #header>
        <div class="card-header">
          <span class="font-bold">{{ $t('app.plugin.distribution.stat.title') }}</span>
          <ElButton @click="refresh" :loading="loading" size="small">
            {{ $t('common.refresh') }}
          </ElButton>
        </div>
      </template>

      <ElTable :data="stats" stripe>
        <ElTableColumn prop="plugin_key" :label="$t('app.plugin.distribution.stat.plugin')" min-width="180" />
        <ElTableColumn prop="latest_version" :label="$t('app.plugin.distribution.stat.latest_version')" width="140" align="center" />
        <ElTableColumn :label="$t('app.plugin.distribution.stat.installed')" width="120" align="center">
          <template #default="{ row }">
            <ElTag type="success" effect="plain">{{ row.installed_count }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('app.plugin.distribution.stat.upgradable')" width="120" align="center">
          <template #default="{ row }">
            <ElTag v-if="row.upgradable_count > 0" type="warning" effect="plain">
              {{ row.upgradable_count }}
            </ElTag>
            <ElTag v-else type="info" effect="plain">0</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('app.plugin.distribution.stat.ungranted')" width="120" align="center">
          <template #default="{ row }">
            <span class="text-gray-500">{{ row.ungranted_count }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('app.plugin.distribution.stat.progress')" min-width="180">
          <template #default="{ row }">
            <ElProgress
              :percentage="row.installed_count === 0 ? 0 : Math.round((row.installed_count - row.upgradable_count) / row.installed_count * 100)"
              :stroke-width="6"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('common.action')" min-width="220" align="center" fixed="right">
          <template #default="{ row }">
            <ElButton
              type="primary"
              size="small"
              :disabled="row.upgradable_count === 0"
              @click="openBatchDialog(row)"
            >
              {{ $t('app.plugin.distribution.stat.batch_upgrade') }}
            </ElButton>
            <ElButton
              v-if="row.installed_count > 0"
              type="warning"
              size="small"
              plain
              @click="openOccupying(row)"
            >
              {{ $t('app.plugin.distribution.stat.occupying') }}
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <BatchUpgradeDialog
      ref="batchDialogRef"
      :plugin-key="selectedPluginKey"
      :version="selectedPluginVersion"
    />
    <OccupyingTenantDialog ref="occupyingDialogRef" />
  </div>
</template>

<style scoped>
.upgrade-aggregate { display: flex; flex-direction: column; }
.aggregate-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.aggregate-card { display: flex; align-items: center; gap: 14px; }
.card-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
.card-body { display: flex; flex-direction: column; }
.card-label { font-size: 12px; color: var(--el-text-color-secondary); }
.card-value { font-size: 22px; font-weight: 600; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
</style>
