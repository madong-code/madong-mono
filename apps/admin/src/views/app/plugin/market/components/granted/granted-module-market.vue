<script setup lang="ts">
/** 租户插件市场 - 对接租户插件生命周期接口 */
import { ref } from 'vue';

import { requestClient } from '#/api/request';

import GrantedModuleList from './granted-module-list.vue';
import GrantedTableHeader from './table-header.vue';

defineOptions({ name: 'GrantedModuleMarket' });

// ── 状态管理 ────────────────────────────
const searchKeyword = ref('');
const activeTab = ref('all');
const currentViewMode = ref<'card' | 'table'>('card');
const loading = ref(false);
const modulesData = ref<any[]>([]);
const totalCount = ref(0);

// ── API 请求（租户已授权插件列表）────────
const buildApiParams = () => {
  const params: Record<string, any> = { page: 1, limit: 100 };
  if (searchKeyword.value) params.keyword = searchKeyword.value;
  if (activeTab.value !== 'all') params.type = activeTab.value;
  return params;
};

const fetchModules = async () => {
  loading.value = true;
  try {
    const params = buildApiParams();
    const response: any = await requestClient.get('/tenant/plugin', { params });
    modulesData.value = response?.items || [];
    totalCount.value = response?.total || modulesData.value.length;
  } finally {
    loading.value = false;
  }
};

// ── 事件处理（无删除）────────────────────
const handleSearch = async (keyword: string) => {
  searchKeyword.value = keyword;
  await fetchModules();
};

const handleTabChange = async (tab: string) => {
  activeTab.value = tab;
  await fetchModules();
};

const handleViewChange = (mode: 'card' | 'table') => {
  currentViewMode.value = mode;
};

const handleRefresh = async () => {
  await fetchModules();
};

// 安装由子弹窗通过 SSE 生命周期接口处理
const handleInstall = async () => {
  await fetchModules();
};

// 卸载由子弹窗通过 SSE 生命周期接口处理
const handleUninstall = async () => {
  await fetchModules();
};

// 更新由子组件通过 SSE 生命周期接口处理
const handleUpdateDb = async () => {
  await fetchModules();
};

// onMounted 由子组件 table-header 挂载时 emit('tabChange') 触发 fetchModules
</script>

<template>
  <div
    class="module-container px-5 py-5 flex flex-col min-h-0"
    v-loading="loading"
  >
    <GrantedTableHeader
      :total-count="totalCount"
      :loading="loading"
      @search="handleSearch"
      @tab-change="handleTabChange"
      @view-change="handleViewChange"
      @refresh="handleRefresh"
    />
    <GrantedModuleList
      class="flex-1 min-h-0"
      :modules="modulesData"
      :view-mode="currentViewMode"
      @install="handleInstall"
      @uninstall="handleUninstall"
      @update="handleUpdateDb"
    />
  </div>
</template>
