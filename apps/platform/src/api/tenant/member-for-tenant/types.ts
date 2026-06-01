export interface TenantMemberRow {
  id: number;
  user_name: string;
  real_name: string;
  avatar?: string;
  mobile_phone?: string;
  email?: string;
  sex?: number;
  is_super: number;
  enabled: number;
  is_locked: number;
  created_at?: string;
  created_date?: string;
  remark?: string;
}
