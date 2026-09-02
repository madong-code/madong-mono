<script setup lang="ts">
/** WP9 矩阵 Tab: 平台 × 租户授权矩阵 */
import { computed, onMounted, ref, watch } from 'vue';

import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCheckboxGroup,
  ElIcon,
  ElTag,
  ElTooltip,
} from 'element-plus';
import { Filter, RefreshCw } from 'lucide-vue-next';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { $t } from '#/locales';

import type { PlatformMatrixResponse } from '#/api/app/plugin/delegation/types';

defineOptions({ name: 'MatrixTab' });

const loading = ref(false);
const data = ref<PlatformMatrixResponse>({ plugins: [], tenants: [], matrix: {} });

// 选中状态
const selectedPlugins = ref<string[]>([]);
const selectedTenants = ref<string[]>([]);

const filteredPlugins = computed(() => {
  if (selectedPlugins.value.length === 0) return data.value.plugins;
  return data.value.plugins.filter((p) => selectedPlugins.value.includes(p));
});
const filteredTenants = computed(() => {
  if (selectedTenants.value.length === 0) return data.value.tenants;
  return data.value.tenants.filter((t) => selectedTenants.value.includes(String(t.id)));
});

const refresh = async () => {
  loading.value = true;
  try {
    data.value = await AppPluginDelegationService.getMatrix();
  } catch {
    data.value = { plugins: [], tenants: [], matrix: {} };
  } finally {
    loading.value = false;
  }
};

defineExpose({ refresh });

onMounted(refresh);

const cellClass = (cell: any) => {
  if (!cell) return 'cell-none';
  if (cell.is_installed === 1) {
    if (cell.auth_status === 'authorized' || cell.auth_status === 'trial') {
      return 'cell-installed';
    }
    return 'cell-installed-unauth';
  }
  if (cell.auth_status === 'authorized' || cell.auth_status === 'trial') {
    return 'cell-granted';
  }
  return 'cell-none';
};

const cellLabel = (cell: any) => {
  if (!cell) return $t('app.plugin.distribution.matrix.cell.none');
  if (cell.is_installed === 1) {
    return cell.version || $t('app.plugin.distribution.matrix.cell.installed');
  }
  if (cell.auth_status === 'authorized') return $t('app.plugin.distribution.matrix.cell.authorized');
  if (cell.auth_status === 'trial') return $t('app.plugin.distribution.matrix.cell.trial');
  return $t('app.plugin.distribution.matrix.cell.none');
};
</script>

<template>
  <div class="matrix-tab" v-loading="loading">
    <!-- 筛选器 -->
    <ElCard shadow="never" class="filter-bar">
      <div class="filter-row">
        <div class="filter-item">
          <ElIcon><Filter /></ElIcon>
          <span class="label">{{ $t('app.plugin.distribution.matrix.filter_plugin') }}:</span>
          <ElCheckboxGroup v-model="selectedPlugins" class="check-group">
            <ElCheckbox
              v-for="p in data.plugins"
              :key="p"
              :value="p"
            >{{ p }}</ElCheckbox>
          </ElCheckboxGroup>
        </div>
      </div>
      <div class="filter-row">
        <div class="filter-item">
          <ElIcon><Filter /></ElIcon>
          <span class="label">{{ $t('app.plugin.distribution.matrix.filter_tenant') }}:</span>
          <ElCheckboxGroup v-model="selectedTenants" class="check-group">
            <ElCheckbox
              v-for="t in data.tenants"
              :key="String(t.id)"
              :value="String(t.id)"
            >{{ t.name }} ({{ t.database_mode }})</ElCheckbox>
          </ElCheckboxGroup>
        </div>
        <ElButton @click="refresh" :loading="loading" size="small" :icon="RefreshCw">
          {{ $t('common.refresh') }}
        </ElButton>
      </div>
    </ElCard>

    <!-- 矩阵表 -->
    <ElCard shadow="never" class="matrix-card">
      <template #header>
        <span class="font-bold">{{ $t('app.plugin.distribution.matrix.title') }}</span>
      </template>

      <div class="matrix-scroll" v-if="filteredPlugins.length > 0 && filteredTenants.length > 0">
        <table class="matrix-table">
          <thead>
            <tr>
              <th class="head-left">{{ $t('app.plugin.distribution.matrix.head_plugin') }}</th>
              <th
                v-for="t in filteredTenants"
                :key="String(t.id)"
                class="head-top"
                :title="`${t.name} (${t.database_mode})`"
              >
                <div class="tenant-name">{{ t.name }}</div>
                <div class="tenant-mode">{{ t.database_mode }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredPlugins" :key="p">
              <th class="head-left">{{ p }}</th>
              <td
                v-for="t in filteredTenants"
                :key="`${p}-${t.id}`"
                :class="cellClass(data.matrix[p]?.[String(t.id)] || null)"
              >
                <ElTooltip :content="cellLabel(data.matrix[p]?.[String(t.id)] || null)">
                  <span class="cell-text">{{ cellLabel(data.matrix[p]?.[String(t.id)] || null) }}</span>
                </ElTooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty">
        {{ $t('app.plugin.distribution.matrix.empty') }}
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.matrix-tab { display: flex; flex-direction: column; gap: 12px; }
.filter-bar { display: flex; flex-direction: column; gap: 8px; }
.filter-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.filter-item .label { font-size: 13px; color: var(--el-text-color-secondary); }
.check-group { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.matrix-card { overflow: hidden; }
.matrix-scroll { overflow: auto; }
.matrix-table { border-collapse: collapse; font-size: 13px; }
.matrix-table th, .matrix-table td {
  border: 1px solid var(--el-border-color-lighter);
  padding: 6px 8px;
  text-align: center;
  min-width: 100px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.matrix-table .head-left {
  background: var(--el-fill-color-light);
  text-align: left;
  position: sticky; left: 0; z-index: 2;
  font-weight: 600;
}
.matrix-table .head-top {
  background: var(--el-fill-color-light);
  position: sticky; top: 0; z-index: 1;
}
.tenant-name { font-weight: 600; }
.tenant-mode { font-size: 11px; color: var(--el-text-color-secondary); }
.cell-none { background: var(--el-fill-color-blank); color: var(--el-text-color-placeholder); }
.cell-granted { background: #fdf6ec; color: #e6a23c; }
.cell-installed { background: #f0f9eb; color: #67c23a; font-weight: 600; }
.cell-installed-unauth { background: #fef0f0; color: #f56c6c; }
.cell-text { display: inline-block; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
.empty { padding: 40px; text-align: center; color: var(--el-text-color-secondary); }
</style>
