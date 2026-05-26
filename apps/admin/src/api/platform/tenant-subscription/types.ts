export interface SubscriptionRow {
  id: number;
  code: string;
  name: string;
  description?: string;
  price?: number;
  price_year?: number;
  max_users?: number;
  max_storage?: number;
  max_agents?: number;
  rate_limit?: number;
  sort?: number;
  is_trial?: number;
  trial_days?: number;
  status: string;
  is_default?: number;
  settings?: Record<string, any>;
  permission_ids?: number[];
  tenant_ids?: number[];
  created_at?: string;
  updated_at?: string;
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
