<script setup lang="ts">
/**
 * 我的应用 (集成页)
 *  - 风格: 参考 admin 端 module-market (搜索+视图+总数同一行 + 分类 Tabs)
 *  - 高度自适应: <Page auto-content-height>
 *  - 卡片模式: 头部 logo+名+key + 中间版本+更新日志 + 底部 1 行大操作按钮 + hover 浮 4 操作按钮
 *  - 表格模式: useVbenVxeGrid
 *  - 5 个独立场景 Drawer (用 useVbenDrawer + connectedComponent 包裹内容组件)
 *  - 数据: usePluginMatrix() 一次拉, 主页 + Drawer 共享
 */
import { computed, onMounted, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElInput,
  ElPagination,
  ElProgress,
  ElRadioButton,
  ElRadioGroup,
  ElTabPane,
  ElTabs,
  ElTag,
  ElTooltip,
} from 'element-plus';
import {
  CircleCheck,
  CircleX,
  Clock,
  CloudDownload,
  Cpu,
  History,
  Key,
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-vue-next';

import { Page } from '#/components/page';
import { Icon } from '#/components/icon';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { usePluginMatrix } from '#/composables/usePluginMatrix';
import { $t } from '#/locales';

import AuthorizeDrawer from './drawers/AuthorizeDrawer.vue';
import InstallDrawer from './drawers/InstallDrawer.vue';
import UninstallDrawer from './drawers/UninstallDrawer.vue';
import UpgradeDrawer from './drawers/UpgradeDrawer.vue';

defineOptions({ name: 'MyAppsIndex' });

const { matrix, loading, refreshAll, pluginRows } = usePluginMatrix();

// ── 工具栏状态 ────────────────────────────
const viewMode = ref<'card' | 'table'>('card');
const searchKey = ref('');
// 本页(我的应用)只展示平台已安装的插件, 故"已安装"即全量(与平台已安装一一对应)
const activeTab = ref<'installed' | 'upgradable' | 'ungranted' | 'empty'>('installed');

const filteredPluginRows = computed(() => {
  const k = searchKey.value.trim().toLowerCase();
  return pluginRows.value.filter((r) => {
    let ok = true;
    switch (activeTab.value) {
      case 'upgradable':
        ok = r.upgradable > 0;
        break;
      case 'ungranted':
        ok = r.ungranted > 0;
        break;
      case 'empty':
        ok = r.installed === 0;
        break;
      default:
        ok = true;
    }
    return ok && (k ? r.key.toLowerCase().includes(k) : true);
  });
});

const tabCounts = computed(() => {
  const k = searchKey.value.trim().toLowerCase();
  const base = k
    ? pluginRows.value.filter((r) => r.key.toLowerCase().includes(k))
    : pluginRows.value;
  return {
    installed: base.length,
    upgradable: base.filter((r) => r.upgradable > 0).length,
    ungranted: base.filter((r) => r.ungranted > 0).length,
    empty: base.filter((r) => r.installed === 0).length,
  };
});

const currentPage = ref(1);
const pageSize = ref(12);
const totalCount = computed(() => filteredPluginRows.value.length);
const currentPagePlugins = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPluginRows.value.slice(start, start + pageSize.value);
});
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};
const onSearchInput = () => {
  currentPage.value = 1;
};
const onTabChange = () => {
  currentPage.value = 1;
};

// ── VxeGrid (useVbenVxeGrid 封装版) ──────────────────
const [VxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'seq', title: '#', width: 60, align: 'center' },
      { title: $t('app.installed.column.plugin'), minWidth: 220, align: 'left', slots: { default: 'name' } },
      { field: 'latestVersion', title: $t('app.installed.column.latest_version'), width: 120, align: 'center' },
      { field: 'installed', title: $t('app.installed.column.installed'), width: 80, align: 'center' },
      { field: 'upgradable', title: $t('app.installed.column.upgradable'), width: 100, align: 'center' },
      { field: 'ungranted', title: $t('app.installed.column.ungranted'), width: 100, align: 'center' },
      {
        title: $t('app.installed.column.action'),
        width: 160,
        align: 'center',
        fixed: 'right',
        slots: { default: 'action' },
      },
    ],
    border: 'none',
    stripe: true,
    size: 'small',
    height: 'auto',
    showOverflow: 'tooltip',
    pagerConfig: { enabled: true, pageSize: pageSize.value, pageSizes: [12, 24, 48, 96] },
    rowConfig: { isHover: true, isCurrent: false },
    proxyConfig: {
      enabled: false,
    },
  } as any,
});
// 响应数据 + 同步到 grid
watch(
  () => filteredPluginRows.value,
  (v) => gridApi.setGridOptions({ data: v }),
  { immediate: true, deep: true },
);

// ── 5 个独立 Drawer (useVbenDrawer + connectedComponent 包裹内容组件) ──
const [AuthDrawerComp, authApi] = useVbenDrawer({
  connectedComponent: AuthorizeDrawer,
});
const [UpgradeDrawerComp, upgradeApi] = useVbenDrawer({
  connectedComponent: UpgradeDrawer,
});
const [UninstallDrawerComp, uninstallApi] = useVbenDrawer({
  connectedComponent: UninstallDrawer,
});
const [InstallDrawerComp, installApi] = useVbenDrawer({
  connectedComponent: InstallDrawer,
});

const openAuth = (key: string) => authApi.setData({ pluginKey: key }).open();
const openUpgrade = (key: string) => upgradeApi.setData({ pluginKey: key }).open();
const openUninstall = (key: string) => uninstallApi.setData({ pluginKey: key }).open();
const openInstall = (prefill = '') => installApi.setData({ prefillName: prefill }).open();

const handleMore = (row: any, cmd: string) => {
  switch (cmd) {
    case 'upgrade':
      openUpgrade(row.key);
      break;
    case 'uninstall':
      openUninstall(row.key);
      break;
  }
};

onMounted(refreshAll);
</script>

<template>
  <Page auto-content-height>
    <div v-loading="loading" class="content">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <ElInput
          v-model="searchKey"
          :placeholder="$t('app.installed.search_placeholder')"
          clearable
          :prefix-icon="Search"
          class="search-input"
          @clear="onSearchInput"
          @input="onSearchInput"
        />
        <div class="toolbar-right">
          <ElRadioGroup v-model="viewMode" size="default" class="view-mode-switch">
            <ElRadioButton label="card">
              <ElIcon style="margin-right: 4px; vertical-align: middle">
                <LayoutGrid />
              </ElIcon>
              {{ $t('app.installed.card_view') }}
            </ElRadioButton>
            <ElRadioButton label="table">
              <ElIcon style="margin-right: 4px; vertical-align: middle">
                <List />
              </ElIcon>
              {{ $t('app.installed.table_view') }}
            </ElRadioButton>
          </ElRadioGroup>
          <span class="toolbar-total">{{ $t('app.installed.total_count', { count: totalCount }) }}</span>
        </div>
      </div>

      <!-- 分类 Tabs -->
      <ElTabs v-model="activeTab" class="category-tabs" @tab-change="onTabChange">
        <ElTabPane :name="'installed'">
          <template #label>
            <span class="tab-label"><ElIcon><CircleCheck /></ElIcon>{{ $t('app.installed.tabs.installed') }}
              <span class="tab-count">{{ tabCounts.installed }}</span>
            </span>
          </template>
        </ElTabPane>
        <ElTabPane :name="'upgradable'">
          <template #label>
            <span class="tab-label"><ElIcon><Clock /></ElIcon>{{ $t('app.installed.tabs.upgradable') }}
              <span class="tab-count warn">{{ tabCounts.upgradable }}</span>
            </span>
          </template>
        </ElTabPane>
        <ElTabPane :name="'ungranted'">
          <template #label>
            <span class="tab-label"><ElIcon><CircleX /></ElIcon>{{ $t('app.installed.tabs.ungranted') }}
              <span class="tab-count">{{ tabCounts.ungranted }}</span>
            </span>
          </template>
        </ElTabPane>
        <ElTabPane :name="'empty'">
          <template #label>
            <span class="tab-label"><ElIcon><Settings2 /></ElIcon>{{ $t('app.installed.tabs.empty') }}
              <span class="tab-count">{{ tabCounts.empty }}</span>
            </span>
          </template>
        </ElTabPane>
      </ElTabs>

      <!-- ── 卡片视图 ── -->
      <div v-if="viewMode === 'card'" class="card-view">
        <div v-if="(matrix?.plugins?.length ?? 0) === 0">
          <ElEmpty :description="$t('app.installed.empty.platform_no_plugins')" class="empty">
            <ElButton type="primary" :icon="RefreshCw" @click="refreshAll">{{ $t('app.installed.empty.refresh') }}</ElButton>
          </ElEmpty>
        </div>
        <div v-else-if="currentPagePlugins.length === 0" class="tab-empty">
          <ElEmpty :description="$t('app.installed.empty.no_match')" />
        </div>
        <div v-else class="plugin-grid">
          <div
            v-for="row in currentPagePlugins"
            :key="row.key"
            class="plugin-card"
            :class="{ 'is-warning': row.upgradable > 0 }"
          >
            <div class="card-header">
              <div class="card-logo">
                <ElIcon :size="20"><Cpu /></ElIcon>
              </div>
              <div class="card-info">
                <div class="card-title">{{ row.key }}</div>
                <div class="card-key">
                  <ElIcon :size="12"><Key /></ElIcon>
                  <span>{{ row.key }}</span>
                </div>
              </div>
            </div>

            <div class="card-body">
              <ElTag size="small" effect="plain" class="version-tag">
                v{{ row.latestVersion }}
              </ElTag>
              <span class="updatelog">
                <ElIcon :size="12"><History /></ElIcon>
                {{ $t('app.installed.card.changelog') }}
              </span>
            </div>

            <div class="card-footer">
              <ElButton
                v-if="row.upgradable > 0"
                type="primary"
                :icon="Upload"
                class="card-action-btn"
                @click.stop="openUpgrade(row.key)"
              >
                {{ $t('app.installed.card.tenants_upgradable', { count: row.upgradable }) }}
              </ElButton>
              <ElButton
                v-else-if="row.ungranted > 0"
                type="warning"
                :icon="ShieldCheck"
                class="card-action-btn"
                @click.stop="openAuth(row.key)"
              >
                {{ $t('app.installed.card.tenants_ungranted', { count: row.ungranted }) }}
              </ElButton>
              <ElButton
                v-else-if="row.installed === 0"
                type="info"
                plain
                :icon="CloudDownload"
                class="card-action-btn"
                @click.stop="openInstall(row.key)"
              >
                {{ $t('app.installed.card.empty') }}
              </ElButton>
              <ElButton
                v-else
                type="success"
                plain
                :icon="CircleCheck"
                class="card-action-btn"
                @click.stop="openAuth(row.key)"
              >
                {{ $t('app.installed.card.all_ready') }}
              </ElButton>
            </div>

            <div class="card-hover-actions" @click.stop>
              <ElTooltip :content="$t('app.installed.tooltip.authorize')" placement="top">
                <ElButton
                  size="small"
                  :icon="ShieldCheck"
                  class="hover-btn"
                  @click.stop="openAuth(row.key)"
                />
              </ElTooltip>
              <ElTooltip :content="$t('app.installed.tooltip.upgrade')" placement="top">
                <ElButton
                  size="small"
                  :icon="Upload"
                  class="hover-btn"
                  @click.stop="openUpgrade(row.key)"
                />
              </ElTooltip>
              <ElTooltip :content="$t('app.installed.tooltip.uninstall')" placement="top">
                <ElButton
                  size="small"
                  type="danger"
                  :icon="Trash2"
                  class="hover-btn"
                  @click.stop="openUninstall(row.key)"
                />
              </ElTooltip>
              <ElTooltip :content="$t('app.installed.tooltip.install')" placement="top">
                <ElButton
                  size="small"
                  type="success"
                  :icon="CloudDownload"
                  class="hover-btn"
                  @click.stop="openInstall(row.key)"
                />
              </ElTooltip>
            </div>
          </div>
        </div>

        <div v-if="totalCount > 0" class="pagination-footer">
          <ElPagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 48, 96]"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- ── 表格视图 (useVbenVxeGrid 封装) ── -->
      <div v-else class="table-view">
        <VxeGrid class="vxe-grid-wrapper pb-5" grid-class="!p-0">
          <template #name="{ row }">
            <div class="table-plugin-cell">
              <div class="table-icon">
                <ElIcon :size="18"><Cpu /></ElIcon>
              </div>
              <div>
                <div class="table-plugin-key">{{ row.key }}</div>
                <div class="table-plugin-sub">{{ $t('app.installed.card.hover_tip') }}</div>
              </div>
            </div>
          </template>
          <template #progress="{ row }">
            <ElProgress
              :percentage="row.pct"
              :stroke-width="6"
              :color="row.upgradable > 0 ? '#e6a23c' : '#67c23a'"
            />
          </template>
          <template #action="{ row }">
            <div class="table-actions">
              <ElButton type="primary" link size="small" @click="openAuth(row.key)">
                {{ $t('app.installed.action.authorize') }}
              </ElButton>
              <ElDropdown trigger="hover" @command="(cmd: string) => handleMore(row, cmd)">
                <ElButton type="primary" link size="small">
                  {{ $t('app.installed.action.more') }}
                  <template #icon>
                    <Icon icon="ant-design:bars-outlined" />
                  </template>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="upgrade">
                      {{ $t('app.installed.action.upgrade') }}
                    </ElDropdownItem>
                    <ElDropdownItem command="uninstall">
                      {{ $t('app.installed.action.uninstall') }}
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
          </template>
        </VxeGrid>
      </div>
    </div>

    <!-- 5 个独立 Drawer 包装 (useVbenDrawer + connectedComponent 模式) -->
    <AuthDrawerComp />
    <UpgradeDrawerComp />
    <UninstallDrawerComp />
    <InstallDrawerComp />
  </Page>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* Page 内层不是 flex 容器, 必须 height: 100% 才能撑满 */
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}
.search-input {
  flex: 1;
  max-width: 480px;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.view-mode-switch :deep(.el-radio-button__inner) {
  display: inline-flex;
  align-items: center;
}
.toolbar-total {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  white-space: nowrap;
}

.category-tabs {
  margin-bottom: 8px;
}
.category-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}
.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}
.tab-count {
  display: inline-block;
  min-width: 18px;
  padding: 0 6px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-size: 11px;
  text-align: center;
  margin-left: 2px;
}
.tab-count.warn {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.card-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.tab-empty {
  padding: 30px 0;
}
.plugin-grid {
  display: grid;
  /* 固定每行 4 张卡片; 屏幕窄时由父容器 .card-view 横向滚动而非折行 */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.plugin-card {
  position: relative;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}
.plugin-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.12);
  transform: translateY(-1px);
}
.plugin-card.is-warning {
  border-left: 3px solid var(--el-color-warning);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}
.card-logo {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-color-primary-light-8));
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.plugin-card.is-warning .card-logo {
  background: linear-gradient(135deg, var(--el-color-warning-light-9), var(--el-color-warning-light-8));
  color: var(--el-color-warning);
}
.card-info {
  flex: 1;
  min-width: 0;
}
.card-title {
  font-weight: 600;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-key {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
  font-family: monospace;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.version-tag {
  color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary-light-7) !important;
  font-family: monospace;
}
.updatelog {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--el-color-primary);
  cursor: pointer;
}
.updatelog:hover {
  text-decoration: underline;
}

.card-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.card-action-btn {
  width: 100%;
}
.card-action-btn :deep(.el-icon) {
  margin-right: 4px;
}

.card-hover-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 6px;
  /* 跟随主题: 暗色用深色半透明 + 浅色边框, 亮色保留原浅色玻璃感 */
  background: var(--el-bg-color-overlay, var(--el-bg-color));
  border: 1px solid var(--el-border-color-lighter);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.18s;
  pointer-events: none;
}
/* 亮色主题下保留一点玻璃感 */
html:not(.dark) .card-hover-actions {
  background: rgba(255, 255, 255, 0.88);
  border-color: transparent;
}
.plugin-card:hover .card-hover-actions {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.hover-btn {
  padding: 4px;
  min-height: auto;
  height: 26px;
  width: 26px;
}
.hover-btn :deep(.el-icon) {
  margin: 0;
}

.table-view {
  flex: 1;
  min-height: 0;
}

.table-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.vxe-grid-wrapper {
  flex: 1;
  height: 100%;
  min-height: 0;
}

/* 明亮主题：给 vxe-grid 表头追加浅色背景，与内容行区分（暗黑主题保持原样） */
html:not(.dark) .vxe-grid-wrapper :deep(.vxe-table--header-wrapper),
html:not(.dark) .vxe-grid-wrapper :deep(.vxe-table--header),
html:not(.dark) .vxe-grid-wrapper :deep(.vxe-header--column) {
  background-color: var(--el-color-primary-light-9, #ecf5ff) !important;
}
.table-plugin-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.table-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.table-plugin-key {
  font-weight: 600;
  font-size: 13px;
  font-family: monospace;
}
.table-plugin-sub {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
}

.pagination-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 0;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: auto;
}

.empty {
  margin: 60px 0;
}
</style>
