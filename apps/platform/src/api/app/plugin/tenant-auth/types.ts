export type PluginAuthStatus = 'authorized' | 'none' | 'trial';

export interface TenantPluginAuthRow {
  auth_status: PluginAuthStatus;
  author?: string;
  description?: string;
  icon?: string;
  installed_at?: null | number;
  installed_version?: null | string;
  is_installed: number;
  plugin_key: string;
  plugin_title: string;
  version: string;
}

export interface TenantPluginAuthListResult {
  items: TenantPluginAuthRow[];
  total: number;
}

export interface TenantPluginAuthorization {
  auth_status: PluginAuthStatus;
  plugin_key: string;
}

export interface SaveTenantPluginAuthData {
  authorizations: TenantPluginAuthorization[];
  tenant_id: string;
}
