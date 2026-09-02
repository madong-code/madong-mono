/** 平台端"插件分发中心"类型 (WP9) */

export interface PlatformMatrixCell {
  auth_status: 'none' | 'authorized' | 'trial' | string;
  is_installed: 0 | 1;
  is_purchased: 0 | 1;
  version: string | null;
  isolation_mode: 'field' | 'database' | null | string;
}

export interface PlatformMatrixResponse {
  plugins: string[];
  tenants: Array<{
    id: string | number;
    code: string;
    name: string;
    database_mode: 'field' | 'database' | string;
    expired_at: string | null;
  }>;
  matrix: Record<string, Record<string, PlatformMatrixCell>>;
}

export interface PlatformUpgradeStat {
  plugin_key: string;
  latest_version: string;
  installed_count: number;
  upgradable_count: number;
  ungranted_count: number;
}

export interface PlatformUpgradeStatsResponse {
  items: PlatformUpgradeStat[];
  total: number;
}

export interface PlatformOccupyingTenant {
  tenant_id: string;
  tenant_name: string | null;
  isolation_mode: string | null;
  version: string | null;
  expired_at: string | null;
}

export interface PlatformOccupyingResponse {
  plugin_key: string;
  count: number;
  items: PlatformOccupyingTenant[];
}

export interface PlatformDependenciesResponse {
  plugin_key: string;
  requires: string[];
  satisfied: string[];
  missing: string[];
}

export interface PlatformBatchUpdatePayload {
  code: string;
  version: string;
  tenant_ids: (string | number)[];
  force?: boolean;
}

export interface PlatformBatchUpdateResponse {
  mode: 'inline' | 'queue';
  total: number;
  processed: number;
  failed: number;
  job_id?: string | number;
  progress: Array<{ msg: string; pct: number; extra?: any }>;
}

export interface PlatformCascadeUninstallPayload {
  /** 插件标识 (兼容 plugin_key) */
  code?: string;
  plugin_key?: string;
  /** 版本, 留空由后端按插件当前版本兜底 */
  version?: string;
  /** 是否强制 (默认 true) */
  force?: boolean;
  /** 指定租户ID列表: 仅卸载这些租户; 留空=全量级联(连带平台层) */
  tenant_ids?: (string | number)[];
}
