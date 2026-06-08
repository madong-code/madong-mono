export interface TenantPluginRow {
  id: number | string;
  tenant_id: number | string;
  plugin_key: string;
  plugin_name?: string;
  plugin_version?: string;
  plugin_description?: string;
  plugin_author?: string;
  plugin_icon?: string;
  status: number;
  is_purchased: number;
  installed_at: null | number;
  created_at: number;
  updated_at: number;
}

export interface TenantPluginListResponse {
  items: TenantPluginRow[];
  total: number;
}
