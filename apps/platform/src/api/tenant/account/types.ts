export interface DbSettingRow {
  id: number;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  driver: string;
  prefix?: string;
  charset?: string;
  collation?: string;
  enabled: number;
  is_default?: number;
  sort?: number;
  description?: string;
  extra_config?: Record<string, any>;
  last_test_result?: boolean;
  last_test_time?: number;
  create_time?: string;
  update_time?: string;
}

export interface TenantSubscriptionRow {
  id: number;
  tenant_id: number;
  subscription_id: number;
  start_time?: string;
  expire_time?: string;
  status: string;
  auto_renew?: boolean;
  payment_status?: string;
  payment_time?: string;
  payment_method?: string;
  transaction_id?: string;
}

export interface TenantRow {
  id: number;
  name: string;
  code: string;
  status: string;
  effective_mode: string;
  start_time?: string;
  database_mode: string;
  db_setting_id?: number;
  database_name?: string;
  domain?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  system_name?: string;
  expire_time?: string;
  suspend_reason?: string;
  suspend_time?: string;
  sort: number;
  settings?: Record<string, any>;
  plan_ids?: number[];
  create_time?: string;
  update_time?: string;
  created_at?: string;
  updated_at?: string;
  active_subscription?: TenantSubscriptionRow;
  db_setting?: DbSettingRow;
}
