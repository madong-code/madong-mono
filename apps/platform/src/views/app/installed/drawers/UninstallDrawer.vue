<script setup lang="ts">
/**
 * UninstallContent - 强制卸载内容 (useVbenDrawer 标准模式)
 *  - 自身 useVbenDrawer 拿注入 api,onOpenChange 时 getData() 读 pluginKey
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useVbenDrawer } from '@vben/common-ui';
import {
  ElAlert,
  ElButton,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElSkeleton,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import { Trash2, Zap } from 'lucide-vue-next';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { usePluginMatrix } from '#/composables/usePluginMatrix';

defineOptions({ name: 'UninstallContent' });

const { t } = useI18n();

const { occupying, occupyingLoading, loadOccupying, refreshAll } = usePluginMatrix();

const pluginKey = ref<string>('');

const [Drawer, drawerApi] = useVbenDrawer({
  title: t('app.installed.drawer.uninstall.title'),
  placement: 'right',
  class: '!w-[70vw] !max-w-[1100px]',
  footer: false,
  destroyOnClose: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ pluginKey: string }>();
      pluginKey.value = data?.pluginKey || '';
      if (pluginKey.value) loadOccupying(pluginKey.value);
    }
  },
  onClosed() {
    refreshAll();
  },
});

watch(pluginKey, (k) => k && loadOccupying(k));

// 勾选 / 全选 (用 Set 记录 tenant_id, 支持跨页)
const selectedRows = ref<any[]>([]);
const selectedCount = computed(() => selectedRows.value.length);
// 始终传明确的租户 id 列表: 选中部分=这些租户; 全选=全部租户 id (不再折叠为 [])
// 后端 tenant_ids 非空即走"选择性卸载": 仅解除各租户侧占用/菜单/数据,
// 不会误触发平台层插件包卸载 —— 真正的代码移除在模块市场进行
const targetTenantIds = computed(() =>
  selectedRows.value.map((r) => r.tenant_id).filter(Boolean),
);

const submitting = ref(false);
const buildConfirm = (forced: boolean) => {
  const scope =
    selectedCount.value === 0
      ? t('app.installed.drawer.uninstall.scope_all')
      : t('app.installed.drawer.uninstall.scope_selected', { count: selectedCount.value });
  return forced
    ? {
        msg: t('app.installed.drawer.uninstall.force_msg', { scope }),
        title: t('app.installed.drawer.uninstall.force_title'),
        confirm: t('app.installed.drawer.uninstall.force_cascade'),
      }
    : {
        msg: t('app.installed.drawer.uninstall.cascade_msg', { scope }),
        title: t('app.installed.drawer.uninstall.cascade_title'),
        confirm: t('app.installed.drawer.uninstall.cascade'),
      };
};
const doCascade = async (forced: boolean) => {
  if (!pluginKey.value) return;
  const { msg, title, confirm } = buildConfirm(forced);
  try {
    await ElMessageBox.confirm(msg, title, {
      type: forced ? 'error' : 'warning',
      confirmButtonText: confirm,
      cancelButtonText: t('app.installed.drawer.uninstall.cancel'),
    });
  } catch {
    return;
  }
  submitting.value = true;
  try {
    const res = await AppPluginDelegationService.cascadeUninstall({
      code: pluginKey.value,
      force: forced,
      tenant_ids: targetTenantIds.value,
    });
    const processed = res?.processed ?? res?.tenants?.length ?? '?';
    ElMessage.success(t('app.installed.drawer.uninstall.success', { count: processed }));
    selectedRows.value = [];
    await refreshAll();
    // 刷新抽屉内的占用租户列表 (refreshAll 只重载 matrix/stats)
    await loadOccupying(pluginKey.value);
  } catch (e: any) {
    ElMessage.error(e?.message || t('app.installed.drawer.uninstall.fail'));
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Drawer>
    <div class="content-body">
      <ElAlert
        :title="$t('app.installed.drawer.uninstall.alert')"
        type="warning"
        :closable="false"
        class="sec-alert"
        show-icon
      />

      <div class="toolbar">
        <div class="toolbar-left">
          <span class="occupy-tip">{{ $t('app.installed.drawer.uninstall.occupying_count', { count: occupying?.items.length ?? 0 }) }}</span>
          <ElTag v-if="selectedCount > 0" type="primary" size="small" effect="plain">
            {{ $t('app.installed.drawer.uninstall.selected', { count: selectedCount }) }}
          </ElTag>
        </div>
        <div class="toolbar-right">
          <ElButton
            type="warning"
            :icon="Trash2"
            :loading="submitting"
            :disabled="selectedCount === 0"
            @click="doCascade(false)"
          >
            {{ $t('app.installed.drawer.uninstall.cascade') }}
          </ElButton>
          <ElButton
            type="danger"
            :icon="Zap"
            :loading="submitting"
            :disabled="selectedCount === 0"
            @click="doCascade(true)"
          >
            {{ $t('app.installed.drawer.uninstall.force_cascade') }}
          </ElButton>
        </div>
      </div>

      <ElSkeleton v-if="occupyingLoading" :rows="4" animated />
      <template v-else-if="occupying">
        <ElEmpty
          v-if="occupying.items.length === 0"
          :description="$t('app.installed.drawer.uninstall.empty', { plugin: pluginKey })"
        />
        <template v-else>
          <div class="table-area">
            <ElTable
              :data="occupying.items"
              stripe
              height="100%"
              row-key="tenant_id"
              @selection-change="(rows:any[]) => (selectedRows = rows)"
            >
              <ElTableColumn type="selection" width="50" align="center" reserve-selection />
              <ElTableColumn prop="tenant_code" :label="$t('app.installed.drawer.uninstall.col_code')" min-width="140" />
              <ElTableColumn prop="tenant_name" :label="$t('app.installed.drawer.uninstall.col_name')" min-width="160" />
              <ElTableColumn :label="$t('app.installed.drawer.uninstall.col_isolation')" width="120" align="center">
                <template #default="{ row }">
                  <ElTag
                    :type="row.isolation_mode === 'database' ? 'warning' : 'info'"
                    effect="plain"
                    size="small"
                  >
                    {{ row.isolation_mode ? (row.isolation_mode === 'database' ? $t('app.installed.isolation.database') : $t('app.installed.isolation.field')) : '—' }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn prop="version" :label="$t('app.installed.drawer.uninstall.col_version')" width="110" align="center">
                <template #default="{ row }">
                  <span class="mono">{{ row.version || '—' }}</span>
                </template>
              </ElTableColumn>
              <ElTableColumn :label="$t('app.installed.drawer.uninstall.col_expired')" width="170" align="center">
                <template #default="{ row }">
                  <span class="text-gray">{{ row.expired_at || '—' }}</span>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </template>
      </template>
    </div>
  </Drawer>
</template>

<style scoped>
.content-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 14px 20px;
}
.sec-alert {
  margin-bottom: 12px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0 10px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
  margin-bottom: 10px;
}
.toolbar-left {
  display: flex;
  align-items: center;
}
.toolbar-right {
  display: flex;
  gap: 8px;
}
.occupy-tip {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.table-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.mono {
  font-family: monospace;
}
.text-gray {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
