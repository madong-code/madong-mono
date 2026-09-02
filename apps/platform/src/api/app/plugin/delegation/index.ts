import type {
  PlatformBatchUpdatePayload,
  PlatformBatchUpdateResponse,
  PlatformCascadeUninstallPayload,
  PlatformDependenciesResponse,
  PlatformMatrixResponse,
  PlatformOccupyingResponse,
  PlatformUpgradeStatsResponse,
} from './types';
import type { AuthInfo } from './types';

import { requestClient } from '#/api/request';

const baseUrl = '/plugin/auth-info';
const tenantAuthUrl = '/plugin/tenant-auth';

export const AppPluginDelegationService = {
  /** 获取授权信息 */
  getAuthInfo(): Promise<AuthInfo> {
    return requestClient.get(baseUrl);
  },

  /** 设置授权信息 */
  setAuthInfo(data: { auth_code: string; auth_secret: string }): Promise<any> {
    return requestClient.post(baseUrl, data);
  },

  // ──────────────────────────────────────────────
  // WP9: 平台 × 租户插件分发中心
  // ──────────────────────────────────────────────

  /** 矩阵 */
  getMatrix(params?: { plugin_keys?: string; tenant_ids?: string }): Promise<PlatformMatrixResponse> {
    return requestClient.get(`${tenantAuthUrl}/matrix`, { params });
  },

  /** 升级统计 */
  getStats(params?: { plugin_keys?: string }): Promise<PlatformUpgradeStatsResponse> {
    return requestClient.get(`${tenantAuthUrl}/stats`, { params });
  },

  /** 占用清单 */
  getOccupying(key: string): Promise<PlatformOccupyingResponse> {
    return requestClient.get(`${tenantAuthUrl}/occupying`, { params: { key } });
  },

  /** 依赖检查 */
  getDependencies(key: string): Promise<PlatformDependenciesResponse> {
    return requestClient.get(`${tenantAuthUrl}/dependencies`, { params: { key } });
  },

  /** 批量升级 (走 BatchExecutor, ≤50 inline SSE / >50 queue) */
  batchUpdate(payload: PlatformBatchUpdatePayload): Promise<PlatformBatchUpdateResponse> {
    return requestClient.post(`${tenantAuthUrl}/batch-update`, payload);
  },

  /** 级联卸载 */
  cascadeUninstall(payload: PlatformCascadeUninstallPayload): Promise<any> {
    return requestClient.post(`${tenantAuthUrl}/cascade-uninstall`, payload);
  },

  /** 批量设置租户授权 (后端已支持批量,前端 1 次请求搞定) */
  setTenantAuth(payload: {
    tenant_ids: Array<string | number>;
    plugin_keys: string[];
    auth_status: 'authorized' | 'trial' | 'ungranted' | 'expired';
  }): Promise<any> {
    return requestClient.post(tenantAuthUrl, payload);
  },

  // ──────────────────────────────────────────────
  // WP10: 远程安装到租户 (走 SSE) —— 把平台已装插件以租户模式推送
  //   安装范围: with_database=true 菜单+数据库 / false 仅菜单
  // ──────────────────────────────────────────────

  /** 启动远程安装到指定租户 (SSE URL, 由组件 new EventSource) */
  getTenantInstallUrl(payload: {
    name: string;
    tenant_id: string;
    with_database?: boolean;
  }): string {
    // 走 query string, EventSource 不支持 POST body
    const qs = new URLSearchParams({
      name: payload.name,
      tenant_id: payload.tenant_id,
      with_database: payload.with_database === false ? '0' : '1',
    });
    return `${tenantAuthUrl}/install?${qs.toString()}`;
  },

  /** 批量升级 (SSE URL, 由组件用 sse() 消费) */
  getUpgradeStreamUrl(payload: {
    code: string;
    version: string;
    tenant_ids?: string[];
    exclude_ids?: string[];
    force?: boolean;
  }): string {
    const qs = new URLSearchParams({ code: payload.code, version: payload.version });
    if (payload.tenant_ids?.length) qs.append('tenant_ids', payload.tenant_ids.join(','));
    if (payload.exclude_ids?.length) qs.append('exclude_ids', payload.exclude_ids.join(','));
    if (payload.force) qs.append('force', '1');
    return `${tenantAuthUrl}/upgrade-stream?${qs.toString()}`;
  },
};
