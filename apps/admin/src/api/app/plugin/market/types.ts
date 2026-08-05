/** 模块市场 - 插件行 */
export interface ModuleRow {
  code: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
  cover?: string;
  type?: string;
  is_installed: number;
  is_purchased: number;
  auth_status?: 'authorized' | 'none' | 'trial';
  can_install?: { allowed: boolean; reason: string };
  can_update?: number;
  has_update?: number;
  installed_version?: null | string;
  version_mismatch?: number;
  category?: string;
  install_status?: string;
}

/** 模块市场 - 列表响应 */
export interface ModuleListResponse {
  items: ModuleRow[];
  total: number;
}
