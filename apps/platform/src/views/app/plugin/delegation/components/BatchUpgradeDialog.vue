<script setup lang="ts">
/** WP9 批量升级弹框
 *  - 调 /plugin/tenant-auth/batch-update
 *  - 选目标租户(预填"可升级"租户) + force
 *  - 显示执行进度 (回收 progress[] 数组)
 */
import { onMounted, ref, watch } from 'vue';

import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElIcon,
  ElMessage,
  ElProgress,
  ElTag,
} from 'element-plus';
import { Rocket, X } from 'lucide-vue-next';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { $t } from '#/locales';

import type { PlatformBatchUpdateResponse } from '#/api/app/plugin/delegation/types';

defineOptions({ name: 'BatchUpgradeDialog' });

const props = defineProps<{
  pluginKey: string | null;
  version: string | null;
}>();

const visible = ref(false);
const running = ref(false);
const force = ref(false);
const selectedTenants = ref<string[]>([]);
const internalKey = ref<string | null>(null);
const internalVersion = ref<string | null>(null);

// "可升级"租户(从 matrix 拉)
const upgradableTenants = ref<Array<{ tenant_id: string; tenant_name: string; current_version: string }>>([]);
const allTenants = ref<Array<{ id: string | number; name: string }>>([]);

const result = ref<PlatformBatchUpdateResponse | null>(null);
const percent = ref(0);
const logs = ref<string[]>([]);

const reset = () => {
  force.value = false;
  selectedTenants.value = [];
  result.value = null;
  percent.value = 0;
  logs.value = [];
  running.value = false;
};

const open = async (key?: string, version?: string) => {
  reset();
  internalKey.value = key ?? props.pluginKey ?? null;
  internalVersion.value = version ?? props.version ?? null;
  if (!internalKey.value) return;
  visible.value = true;
  await loadTenants();
};

const loadTenants = async () => {
  try {
    const m = await AppPluginDelegationService.getMatrix({ plugin_keys: internalKey.value || '' });
    allTenants.value = m.tenants;
    // 拉取"已装但版本落后"租户: matrix 里有 is_installed=1 且 version !== latest
    const latest = internalVersion.value || '';
    const upList: typeof upgradableTenants.value = [];
    for (const t of m.tenants) {
      const cell = m.matrix[internalKey.value!]?.[String(t.id)];
      if (cell && cell.is_installed === 1 && cell.version && cell.version !== latest) {
        upList.push({
          tenant_id: String(t.id),
          tenant_name: t.name,
          current_version: cell.version,
        });
      }
    }
    upgradableTenants.value = upList;
    // 默认勾选所有"可升级"租户
    selectedTenants.value = upList.map((t) => t.tenant_id);
  } catch (e) {
    // ignore
  }
};

const close = () => {
  if (running.value) return;
  visible.value = false;
};

const start = async () => {
  if (!internalKey.value || !internalVersion.value) {
    ElMessage.error($t('app.plugin.distribution.batch.invalid'));
    return;
  }
  if (selectedTenants.value.length === 0) {
    ElMessage.warning($t('app.plugin.distribution.batch.no_target'));
    return;
  }
  running.value = true;
  result.value = null;
  percent.value = 0;
  logs.value = [];
  try {
    const res = await AppPluginDelegationService.batchUpdate({
      code: internalKey.value,
      version: internalVersion.value,
      tenant_ids: selectedTenants.value,
      force: force.value,
    });
    result.value = res;
    percent.value = 100;
    if (res.progress) {
      res.progress.forEach((p) => logs.value.push(`[${p.pct}%] ${p.msg}`));
    }
    ElMessage.success(
      $t('app.plugin.distribution.batch.success', {
        processed: res.processed,
        total: res.total,
        mode: res.mode,
      }),
    );
  } catch (e: any) {
    logs.value.push(`[error] ${e?.message || 'unknown'}`);
    ElMessage.error(e?.message || $t('app.plugin.distribution.batch.fail'));
  } finally {
    running.value = false;
  }
};

defineExpose({ open });
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="$t('app.plugin.distribution.batch.title', { plugin: pluginKey, version })"
    width="640px"
    :close-on-click-modal="false"
    :show-close="!running"
    align-center
  >
    <div class="batch-dialog">
      <!-- 概览 -->
      <div class="overview">
        <ElTag type="warning" effect="plain">
          {{ $t('app.plugin.distribution.batch.upgradable_count', { count: upgradableTenants.length }) }}
        </ElTag>
        <span class="hint">{{ $t('app.plugin.distribution.batch.hint') }}</span>
      </div>

      <!-- 目标租户 -->
      <div class="form-row">
        <div class="label">{{ $t('app.plugin.distribution.batch.target') }}</div>
        <ElCheckboxGroup v-model="selectedTenants" class="checkbox-grid">
          <ElCheckbox
            v-for="t in upgradableTenants"
            :key="t.tenant_id"
            :value="t.tenant_id"
            :disabled="running"
          >
            <span class="tenant-line">
              <span class="name">{{ t.tenant_name }}</span>
              <span class="ver">{{ t.current_version }}</span>
              <ElIcon><X /></ElIcon>
              <span class="ver-new">{{ version }}</span>
            </span>
          </ElCheckbox>
        </ElCheckboxGroup>
      </div>

      <!-- 强制选项 -->
      <div class="form-row">
        <ElCheckbox v-model="force" :disabled="running">
          {{ $t('app.plugin.distribution.batch.force') }}
        </ElCheckbox>
      </div>

      <!-- 进度 -->
      <div v-if="running || result" class="progress-section">
        <ElProgress :percentage="percent" :stroke-width="12" />
        <div v-if="result" class="result-line">
          <ElTag :type="result.failed > 0 ? 'warning' : 'success'" effect="plain">
            {{ $t('app.plugin.distribution.batch.result', {
              processed: result.processed,
              total: result.total,
              failed: result.failed,
              mode: result.mode
            }) }}
          </ElTag>
        </div>
        <div v-if="logs.length" class="log-box">
          <div v-for="(l, idx) in logs" :key="idx" class="log-line">{{ l }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <ElButton v-if="!running" @click="close">
        {{ $t('common.cancel') }}
      </ElButton>
      <ElButton
        v-if="!running && !result"
        type="primary"
        :icon="Rocket"
        @click="start"
        :disabled="selectedTenants.length === 0"
      >
        {{ $t('app.plugin.distribution.batch.start') }}
      </ElButton>
      <ElButton v-if="!running && result" type="primary" @click="close">
        {{ $t('common.confirm') }}
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.batch-dialog { display: flex; flex-direction: column; gap: 16px; }
.overview { display: flex; align-items: center; gap: 12px; }
.overview .hint { font-size: 12px; color: var(--el-text-color-secondary); }
.form-row { display: flex; flex-direction: column; gap: 8px; }
.form-row .label { font-size: 13px; font-weight: 600; }
.checkbox-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.tenant-line { display: inline-flex; align-items: center; gap: 4px; }
.tenant-line .ver { font-family: monospace; font-size: 12px; color: var(--el-color-warning); }
.tenant-line .ver-new { font-family: monospace; font-size: 12px; color: var(--el-color-success); }
.progress-section { display: flex; flex-direction: column; gap: 8px; padding: 12px; background: var(--el-fill-color-light); border-radius: 6px; }
.result-line { display: flex; gap: 8px; }
.log-box { max-height: 160px; overflow-y: auto; padding: 8px; background: var(--el-bg-color); border-radius: 4px; font-family: monospace; font-size: 12px; }
.log-line { line-height: 1.6; }
</style>
