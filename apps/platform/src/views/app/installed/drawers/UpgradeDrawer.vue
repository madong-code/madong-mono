<script setup lang="ts">
/**
 * UpgradeContent - 插件升级内容 (useVbenDrawer 标准模式)
 *  - 自身 useVbenDrawer 拿注入 api,onOpenChange 时 getData() 读 pluginKey
 *  - 可升级租户列表支持分页
 *  - 多选框勾选: 默认全选(等价"一键升级全部"), 分页后仍跨页保留选择
 *  - 执行升级在独立弹窗中通过 SSE 实时输出进度
 */
import { computed, ref, watch } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import {
  ElAlert,
  ElButton,
  ElCheckbox,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import { Upload } from 'lucide-vue-next';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';
import { usePluginMatrix } from '#/composables/usePluginMatrix';
import { $t } from '#/locales';

import UpgradeProgressModal from '../components/UpgradeProgressModal.vue';

defineOptions({ name: 'UpgradeContent' });

const { matrix, latestVersionOf, refreshAll } = usePluginMatrix();

const pluginKey = ref<string>('');

const [Drawer, drawerApi] = useVbenDrawer({
  title: $t('app.plugin.distribution.upgrade.title'),
  placement: 'right',
  class: '!w-[70vw] !max-w-[1100px]',
  footer: false,
  destroyOnClose: false,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = drawerApi.getData<{ pluginKey: string }>();
      pluginKey.value = data?.pluginKey || '';
      // 确保 matrix 已加载 (避免首次打开时 matrix 还在加载中导致空白)
      if (!matrix.value) {
        await refreshAll();
      }
      targetVersion.value = latestVersionOf(pluginKey.value) || '';
      page.value = 1;
    }
  },
  onClosed() {
    refreshAll();
  },
});

const upgradableTenants = computed(() => {
  if (!matrix.value || !pluginKey.value) return [];
  const latest = latestVersionOf(pluginKey.value);
  return matrix.value.tenants
    .map((t) => {
      const cell = matrix.value!.matrix[pluginKey.value!]?.[String(t.id)];
      return {
        tenant_id: t.id,
        tenant_code: t.code,
        tenant_name: t.name,
        version: cell?.version || null,
        is_installed: cell?.is_installed ?? 0,
        // 租户隔离模式(后端 getMatrix 已返回 database_mode): field=字段隔离 / database=库隔离
        isolation_mode: t.database_mode || 'field',
      };
    })
    .filter((r) => r.is_installed === 1 && r.version && r.version !== latest);
});

// ========== 分页 ==========
const page = ref(1);
const pageSize = ref(10);

const paginatedTenants = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return upgradableTenants.value.slice(start, start + pageSize.value);
});

// ========== 勾选（跨页保留） ==========
const selectedIds = ref<Set<string>>(new Set());

const selectedRows = computed(() =>
  upgradableTenants.value.filter((r: any) =>
    selectedIds.value.has(String(r.tenant_id)),
  ),
);

const isAllSelected = computed(() => {
  if (upgradableTenants.value.length === 0) return false;
  return upgradableTenants.value.every((r: any) =>
    selectedIds.value.has(String(r.tenant_id)),
  );
});

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(
      upgradableTenants.value.map((r: any) => String(r.tenant_id)),
    );
  }
};

const toggleRow = (row: any) => {
  const id = String(row.tenant_id);
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
};

const clearSelection = () => {
  selectedIds.value = new Set();
};

// 可升级租户列表变化后默认全选(保持原有"一键升级全部"的行为)
watch(
  upgradableTenants,
  () => {
    selectedIds.value = new Set(
      upgradableTenants.value.map((r: any) => String(r.tenant_id)),
    );
  },
  { immediate: true },
);

// ========== 升级弹窗 ==========
const [ProgressModal, progressModalApi] = useVbenModal({
  connectedComponent: UpgradeProgressModal,
});

const targetVersion = ref('');
const force = ref(false);

const doUpgrade = () => {
  if (!pluginKey.value) return;
  if (!targetVersion.value) {
    ElMessage.warning($t('app.plugin.distribution.upgrade.msg_version_required'));
    return;
  }
  if (upgradableTenants.value.length === 0) {
    ElMessage.info($t('app.plugin.distribution.upgrade.msg_no_upgradable'));
    return;
  }
  if (selectedRows.value.length === 0) {
    ElMessage.warning($t('app.plugin.distribution.upgrade.msg_no_selection'));
    return;
  }

  const allIds = upgradableTenants.value.map((r: any) => String(r.tenant_id));
  const selectedIdsArr = selectedRows.value.map((r: any) => String(r.tenant_id));
  const unselectedIds = allIds.filter((id) => !selectedIdsArr.includes(id));

  // 全选(或不传 ID 列表)交由后端计算全部可升级; 部分勾选则传"较少的一侧"避免 URL 过长
  const tenantPayload: any = {};
  if (selectedIdsArr.length <= unselectedIds.length) {
    tenantPayload.tenant_ids = selectedIdsArr;
  } else {
    tenantPayload.exclude_ids = unselectedIds;
  }

  progressModalApi.setData({
    code: pluginKey.value,
    version: targetVersion.value,
    force: force.value,
    tenantPayload,
  });
  progressModalApi.open();
};
</script>

<template>
  <Drawer>
    <div class="content-body">
      <ElAlert
        :title="$t('app.plugin.distribution.upgrade.hint')"
        type="warning"
        :closable="false"
        class="sec-alert"
        show-icon
      />

      <div class="toolbar">
        <div class="toolbar-left">
          <ElForm inline class="sec-form">
            <ElFormItem :label="$t('app.plugin.distribution.upgrade.target_version')">
              <ElInput
                v-model="targetVersion"
                :placeholder="$t('app.plugin.distribution.upgrade.target_placeholder')"
                style="width: 160px"
              />
            </ElFormItem>
            <ElFormItem>
              <span class="force-row">
                <input v-model="force" type="checkbox" id="force-upgrade" />
                <label for="force-upgrade">
                  {{ $t('app.plugin.distribution.upgrade.force') }}
                </label>
              </span>
            </ElFormItem>
          </ElForm>
        </div>
        <div class="toolbar-right">
          <ElButton
            :disabled="upgradableTenants.length === 0"
            @click="toggleSelectAll"
          >
            {{
              isAllSelected
                ? $t('app.plugin.distribution.upgrade.clear')
                : $t('app.plugin.distribution.upgrade.select_all')
            }}
          </ElButton>
          <ElButton
            type="primary"
            :icon="Upload"
            :disabled="selectedRows.length === 0"
            @click="doUpgrade"
          >
            {{ $t('app.plugin.distribution.upgrade.execute', { count: selectedRows.length }) }}
          </ElButton>
        </div>
      </div>

      <ElEmpty
        v-if="upgradableTenants.length === 0"
        :description="$t('app.plugin.distribution.upgrade.all_latest')"
      />
      <template v-else>
        <div class="table-area">
          <div class="table-wrap">
            <ElTable
              :data="paginatedTenants"
              row-key="tenant_id"
              stripe
              height="100%"
            >
              <ElTableColumn width="50" align="center">
                <template #header>
                  <ElCheckbox
                    :model-value="isAllSelected"
                    @change="toggleSelectAll"
                  />
                </template>
                <template #default="{ row }">
                  <ElCheckbox
                    :model-value="selectedIds.has(String(row.tenant_id))"
                    @change="toggleRow(row)"
                  />
                </template>
              </ElTableColumn>
              <ElTableColumn
                prop="tenant_code"
                :label="$t('app.plugin.distribution.upgrade.tenant_code')"
                min-width="140"
              />
              <ElTableColumn
                prop="tenant_name"
                :label="$t('app.plugin.distribution.upgrade.tenant_name')"
                min-width="160"
              />
              <ElTableColumn
                :label="$t('app.plugin.distribution.upgrade.tenant_type')"
                width="110"
                align="left"
              >
                <template #default="{ row }">
                  <ElTag
                    :type="row.isolation_mode === 'database' ? 'warning' : 'info'"
                    size="small"
                  >
                    {{
                      row.isolation_mode === 'database'
                        ? $t('app.plugin.distribution.upgrade.isolation_database')
                        : $t('app.plugin.distribution.upgrade.isolation_field')
                    }}
                  </ElTag>
                </template>
              </ElTableColumn>
              <ElTableColumn
                :label="$t('app.plugin.distribution.upgrade.current_version')"
                width="140"
                align="center"
              >
                <template #default="{ row }">
                  <span class="mono version-from">{{ row.version }}</span>
                </template>
              </ElTableColumn>
              <ElTableColumn
                :label="$t('app.plugin.distribution.upgrade.target_version')"
                width="140"
                align="center"
              >
                <template #default="{ row }">
                  <span class="mono version-to">v{{ targetVersion || '—' }}</span>
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
          <div class="pagination-bar">
            <ElPagination
              v-model:current-page="page"
              v-model:page-size="pageSize"
              :total="upgradableTenants.length"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              background
            />
          </div>
        </div>
      </template>

      <ProgressModal />
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
.sec-form {
  margin-bottom: 0;
}
.force-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  cursor: pointer;
}
.force-row input {
  cursor: pointer;
}
.table-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.pagination-bar {
  padding: 12px 0 4px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}
.version-from {
  font-family: monospace;
  text-decoration: line-through;
  opacity: 0.6;
}
.version-to {
  font-family: monospace;
  color: var(--el-color-primary);
  font-weight: 600;
}
.mono {
  font-family: monospace;
}
</style>
