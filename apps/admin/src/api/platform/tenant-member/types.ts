export interface TenantMemberRow {
  id: number;
  user_name: string;
  real_name: string;
  avatar?: string;
  mobile_phone?: string;
  email?: string;
  sex?: number;
  enabled: number;
  is_locked: number;
  is_super: number;
  remark?: string;
  managed_tenants?: any[];
  created_at?: string;
  created_date?: string;
}
