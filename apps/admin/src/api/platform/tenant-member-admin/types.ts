export interface TenantMemberAdminRow {
  id: number;
  admin_id: number;
  tenant_id: number;
  role: string;
  is_default: number;
  is_super?: number;
  priority?: number;
  tenant_name?: string;
  tenant_company_name?: string;
  tenant?: {
    company_name?: string;
    name?: string;
  };
  created_at?: string;
  created_date?: string;
  updated_date?: string;
}
