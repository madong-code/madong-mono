<script setup lang="ts">
/** WP9 占用清单弹框 (OccupyingTenantDialog) */
import { ref } from 'vue';

import {
  ElButton,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';

import type { PlatformOccupyingResponse } from '#/api/app/plugin/delegation/types';

defineOptions({ name: 'OccupyingTenantDialog' });

const visible = ref(false);
const loading = ref(false);
const pluginKey = ref<string | null>(null);
const data = ref<PlatformOccupyingResponse | null>(null);
const pendingForced = ref(false);

const open = async (key: string, forced = false) => {
  pluginKey.value = key;
  pendingForced.value = forced;
  data.value = null;
  visible.value = true;
  await load();
  // 外部从单元格详情弹窗"强制级联卸载"进来,自动触发确认
  if (forced) {
    await doCascadeUninstall(true);
  }
};

const load = async () => {
  if (!pluginKey.value) return;
  loading.value = true;
  try {
    data.value = await AppPluginDelegationService.getOccupying(pluginKey.value);
  } catch (e) {
    data.value = { plugin_key: pluginKey.value, count: 0, items: [] };
  } finally {
    loading.value = false;
  }
};

const close = () => {
  visible.value = false;
};

const doCascadeUninstall = async (forced: boolean) => {
  if (!pluginKey.value) return;
  try {
    await ElMessageBox.confirm(
      forced
        ? `【强制】级联卸载 ${pluginKey.value}?\n将忽略所有占用阻断,清理全部租户数据,且不可撤销。`
        : `级联卸载 ${pluginKey.value}?\n被占用会被阻止,执行将级联清理所有租户的该插件数据。`,
      '危险操作',
      {
        type: forced ? 'error' : 'warning',
        confirmButtonText: forced ? '强制执行' : '确认卸载',
        cancelButtonText: '取消',
      },
    );
  } catch {
    return;
  }
  try {
    // 查 stats 拿 latest_version, 后端 cascadeUninstall 必须有 version
    const stats = await AppPluginDelegationService.getStats({ plugin_keys: pluginKey.value });
    const latestVersion = stats.items[0]?.latest_version || '';
    if (!latestVersion) {
      ElMessage.error('未找到该插件的最新版本,无法执行级联卸载');
      return;
    }
    const res = await AppPluginDelegationService.cascadeUninstall({ code: pluginKey.value, version: latestVersion });
    ElMessage.success(
      `级联卸载完成,租户失败: ${res.tenant_failed ?? 0},平台结果: ${res.platform?.status ?? '—'}`,
    );
    close();
  } catch (e: any) {
    ElMessage.error(e?.message || '级联卸载失败');
  }
};

defineExpose({ open });
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="`占用租户 (${pluginKey}) · ${data?.count ?? 0}`"
    width="700px"
    align-center
    v-loading="loading"
  >
    <ElTable v-if="data" :data="data.items" stripe>
      <ElTableColumn prop="tenant_name" label="租户" min-width="160" />
      <ElTableColumn prop="tenant_id" label="租户ID" width="120" align="center" />
      <ElTableColumn label="隔离模式" width="120" align="center">
        <template #default="{ row }">
          <ElTag :type="row.isolation_mode === 'database' ? 'warning' : 'info'" effect="plain" size="small">
            {{ row.isolation_mode || '—' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="version" label="版本" width="100" align="center" />
      <ElTableColumn label="到期时间" width="160" align="center">
        <template #default="{ row }">
          <span class="text-gray-500">{{ row.expired_at || '—' }}</span>
        </template>
      </ElTableColumn>
    </ElTable>

    <div v-if="data && data.count > 0" class="danger-zone">
      <ElButton type="warning" plain @click="doCascadeUninstall(false)">级联卸载</ElButton>
      <ElButton type="danger" plain @click="doCascadeUninstall(true)">强制级联卸载</ElButton>
      <span class="hint">将作用于全部租户的该插件,不可撤销</span>
    </div>

    <template #footer>
      <ElButton @click="close">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.danger-zone { margin-top: 16px; padding: 12px; background: var(--el-color-danger-light-9); border-radius: 6px; display: flex; align-items: center; gap: 12px; }
.danger-zone .hint { font-size: 12px; color: var(--el-text-color-secondary); }
</style>
