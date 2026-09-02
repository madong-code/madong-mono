/**
 * usePluginMatrix - 平台端 "我的应用" 集成页共享数据层 (单例)
 *  - 整个模块只维护 **一份** state, 主页 + 5 个 Drawer 共享同一份 matrix
 *  - 因此任一组件调用 refreshAll() 都会更新 **所有** 组件
 *    => 抽屉里授权/升级/卸载/安装完成后, "我的应用" 页面自动刷新
 *  - 派生: headerKpi / pluginRows / tenantStats / matrixKpi
 *  - 派生: getCellStatus(pluginKey, tenantId) 给矩阵用
 *
 * 注意: 此处 state 是模块级单例, 不要在此依赖任何组件级生命周期。
 */
import { computed, ref } from 'vue';

import { ElMessage } from 'element-plus';

import { AppPluginDelegationService } from '#/api/app/plugin/delegation';

import type {
  PlatformMatrixResponse,
  PlatformMatrixCell,
  PlatformOccupyingResponse,
  PlatformUpgradeStat,
} from '#/api/app/plugin/delegation/types';

export type CellStatus = 'latest' | 'outdated' | 'trial' | 'ungranted' | 'empty';

export interface PluginRow {
  key: string;
  latestVersion: string;
  installed: number;
  upgradable: number;
  ungranted: number;
  tenantTotal: number;
  pct: number;
  status: 'ok' | 'upgradable';
}

export interface TenantStat {
  tenant_id: string;
  tenant_code: string;
  tenant_name: string;
  expired_at: string | null;
  total: number;
  installed: number;
  upgradable: number;
  ungranted: number;
  progress: number;
}

const STATUS_LABEL: Record<CellStatus, string> = {
  latest: '已装-最新版',
  outdated: '可升级',
  trial: '试用',
  ungranted: '未授权',
  empty: '—',
};

// ─────────────── 模块级单例 state ───────────────
const matrix = ref<PlatformMatrixResponse | null>(null);
const statsMap = ref<Map<string, PlatformUpgradeStat>>(new Map());
const loading = ref(false);
const currentKey = ref<string | null>(null);

// 当前插件的依赖 + 占用, 由调用方在 watch 里驱动
const deps = ref<{ plugin_key: string; requires: string[]; satisfied: string[]; missing: string[] } | null>(null);
const depsLoading = ref(false);
const occupying = ref<PlatformOccupyingResponse | null>(null);
const occupyingLoading = ref(false);

/** 拉总数据 (进入页面或点"刷新") */
const refreshAll = async () => {
  loading.value = true;
  try {
    const [m, s] = await Promise.all([
      AppPluginDelegationService.getMatrix(),
      AppPluginDelegationService.getStats(),
    ]);
    matrix.value = m;
    const map = new Map<string, PlatformUpgradeStat>();
    for (const it of s.items) map.set(it.plugin_key, it);
    statsMap.value = map;
    if (!currentKey.value || !m.plugins.includes(currentKey.value)) {
      currentKey.value = m.plugins[0] || null;
    }
  } catch (e: any) {
    ElMessage.error(e?.message || '加载失败');
    matrix.value = { plugins: [], tenants: [], matrix: {} };
  } finally {
    loading.value = false;
  }
};

/** 拉当前插件的依赖 (Tab 2 用), 可显式传入 pluginKey */
const loadDeps = async (key?: string) => {
  const k = key ?? currentKey.value;
  if (!k) {
    deps.value = null;
    return;
  }
  currentKey.value = k;
  depsLoading.value = true;
  try {
    deps.value = await AppPluginDelegationService.getDependencies(k);
  } catch {
    deps.value = { plugin_key: k, requires: [], satisfied: [], missing: [] };
  } finally {
    depsLoading.value = false;
  }
};

/** 拉当前插件的占用 (Tab 2 / 弹窗用), 可显式传入 pluginKey */
const loadOccupying = async (key?: string) => {
  const k = key ?? currentKey.value;
  if (!k) {
    occupying.value = null;
    return;
  }
  currentKey.value = k;
  occupyingLoading.value = true;
  try {
    occupying.value = await AppPluginDelegationService.getOccupying(k);
  } catch {
    occupying.value = { plugin_key: k, count: 0, items: [] };
  } finally {
    occupyingLoading.value = false;
  }
};

/** 切换当前插件, 拉 deps + occupying */
const selectKey = async (key: string | null) => {
  currentKey.value = key;
  if (key) {
    await Promise.all([loadDeps(key), loadOccupying(key)]);
  } else {
    deps.value = null;
    occupying.value = null;
  }
};

// ─────────────── 派生 KPI (Tab 0 头部用) ───────────────
const headerKpi = computed(() => {
  const stats = Array.from(statsMap.value.values());
  const tenantCount = matrix.value?.tenants.length ?? 0;
  return {
    pluginCount: stats.length,
    tenantCount,
    installed: stats.reduce((a, c) => a + (c.installed_count ?? 0), 0),
    upgradable: stats.reduce((a, c) => a + (c.upgradable_count ?? 0), 0),
    ungranted: stats.reduce((a, c) => a + (c.ungranted_count ?? 0), 0),
  };
});

// ─────────────── 派生 pluginRows (Tab 0 卡片用) ───────────────
const pluginRows = computed<PluginRow[]>(() => {
  const plugins = matrix.value?.plugins || [];
  const { matrix: m, tenants } = matrix.value || { matrix: {}, tenants: [] };
  const latestMap = new Map<string, string>();
  for (const [k, s] of statsMap.value.entries()) latestMap.set(k, s.latest_version);

  return plugins.map((key) => {
    const s = statsMap.value.get(key);
    const totalTenants = tenants.length;
    const pluginMatrix = m[key] || {};
    let installed = 0;
    let upgradable = 0;
    let ungranted = 0;
    for (const t of tenants) {
      const cell = pluginMatrix[String(t.id)];
      const authStatus = cell?.auth_status ?? 'none';
      const isInstalled = cell?.is_installed === 1;

      // 未授权按授权状态统计, 不要再把"已授权但未运行态安装"算进来
      if (authStatus === 'none' || authStatus === 'ungranted') {
        ungranted += 1;
      }
      if (isInstalled) {
        installed += 1;
        const latest = latestMap.get(key) || s?.latest_version || '';
        if (cell.version && latest && cell.version !== latest) upgradable += 1;
      }
    }
    const pct = totalTenants > 0 ? Math.round((installed / totalTenants) * 100) : 0;
    return {
      key,
      latestVersion: s?.latest_version || '—',
      installed,
      upgradable,
      ungranted,
      tenantTotal: totalTenants,
      pct,
      status: upgradable > 0 ? 'upgradable' : 'ok',
    };
  });
});

// ─────────────── 派生 tenantStats (Tab 1 表格用) ───────────────
const tenantStats = computed<TenantStat[]>(() => {
  if (!matrix.value) return [];
  const { plugins, tenants, matrix: m } = matrix.value;
  const latestMap = new Map<string, string>();
  for (const [k, s] of statsMap.value.entries()) latestMap.set(k, s.latest_version);

  const rows: TenantStat[] = [];
  for (const t of tenants) {
    let installed = 0, upgradable = 0, ungranted = 0, total = 0;
    for (const pk of plugins) {
      const cell = m[pk]?.[String(t.id)];
      if (!cell) continue;
      total += 1;
      const authStatus = cell.auth_status ?? 'none';
      if (authStatus === 'none' || authStatus === 'ungranted') {
        ungranted += 1;
      }
      if (cell.is_installed === 1) {
        installed += 1;
        const latest = latestMap.get(pk) || '';
        if (cell.version && latest && cell.version !== latest) {
          upgradable += 1;
        }
      }
    }
    rows.push({
      tenant_id: String(t.id),
      tenant_name: t.name,
      expired_at: t.expired_at,
      total,
      installed,
      upgradable,
      ungranted,
      progress: total === 0 ? 0 : Math.round(((installed - upgradable) / total) * 100),
    });
  }
  rows.sort((a, b) => b.upgradable - a.upgradable || b.ungranted - a.ungranted);
  return rows;
});

// ─────────────── 派生 matrixKpi (Tab 2 头部用) ───────────────
const matrixKpi = computed(() => {
  let installed = 0, upgradable = 0, ungranted = 0, trial = 0, total = 0;
  if (!matrix.value) {
    return { total: 0, installed: 0, upgradable: 0, ungranted: 0, trial: 0 };
  }
  for (const t of matrix.value.tenants) {
    for (const pk of matrix.value.plugins) {
      total += 1;
      const cell = matrix.value.matrix[pk]?.[String(t.id)];
      const authStatus = cell?.auth_status ?? 'none';
      const isInstalled = cell?.is_installed === 1;

      if (authStatus === 'trial') trial += 1;
      else if (authStatus === 'none' || authStatus === 'ungranted') ungranted += 1;

      if (isInstalled) {
        installed += 1;
        const latest = statsMap.value.get(pk)?.latest_version || '';
        if (cell.version && latest && cell.version !== latest) upgradable += 1;
      }
    }
  }
  return { total, installed, upgradable, ungranted, trial };
});

/** 给矩阵单元格计算状态 (Tab 2 用) */
const getCellStatus = (pluginKey: string, tenantId: string | number): CellStatus => {
  if (!matrix.value) return 'empty';
  const cell = matrix.value.matrix[pluginKey]?.[String(tenantId)];
  if (!cell) return 'empty';
  if (cell.is_installed !== 1) {
    return cell.auth_status === 'trial' ? 'trial' : 'ungranted';
  }
  const latest = statsMap.value.get(pluginKey)?.latest_version || '';
  if (cell.version && latest && cell.version !== latest) return 'outdated';
  return 'latest';
};

const isAnomaly = (s: CellStatus) => s === 'outdated' || s === 'ungranted';

/** 单元格原始数据 (Tab 2 弹窗用) */
const getCell = (pluginKey: string, tenantId: string | number): PlatformMatrixCell | null => {
  return matrix.value?.matrix[pluginKey]?.[String(tenantId)] || null;
};

const latestVersionOf = (pluginKey: string) => statsMap.value.get(pluginKey)?.latest_version || '';

export function usePluginMatrix() {
  return {
    // state
    matrix,
    statsMap,
    loading,
    currentKey,
    deps,
    depsLoading,
    occupying,
    occupyingLoading,

    // actions
    refreshAll,
    selectKey,
    loadDeps,
    loadOccupying,

    // computed
    headerKpi,
    pluginRows,
    tenantStats,
    matrixKpi,

    // helpers
    getCellStatus,
    isAnomaly,
    getCell,
    latestVersionOf,

    // const
    STATUS_LABEL,
  };
}
