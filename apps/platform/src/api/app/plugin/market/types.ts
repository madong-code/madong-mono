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
  category?: string;
  install_status?: string;
}

/** 模块市场 - 列表响应 */
export interface ModuleListResponse {
  items: ModuleRow[];
  total: number;
}

export interface PluginUninstallImpactItem {
  installed_at?: number;
  installed_version: string;
  status: number;
  tenant_id: string;
  tenant_name: string;
}

export interface PluginUninstallImpact {
  has_impact: boolean;
  items: PluginUninstallImpactItem[];
  message: string;
  plugin: string;
  strategy: 'disable_only';
  total: number;
}
