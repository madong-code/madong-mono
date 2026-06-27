// 协议数据
export interface AgreementData {
  title: string;
  content: string;
  version: string;
  update_time: string;
}

// 环境检测项
export interface EnvironmentCheckItem {
  name: string;
  need: string;
  required: string;
  current: string;
  status: boolean;
  status_text: string;
  message: string;
  is_required: boolean;
}

// 目录权限检查结果
export interface DirectoryPermissionCheckResult {
  path: string;
  path_name: string;
  name: string;
  required: boolean;
  permission_type: 'read_only' | 'read_write' | 'write_only';
  description: string;
  exists: boolean;
  is_readable: boolean;
  is_writable: boolean;
  status: boolean;
  status_text: string;
  message: string;
}

// 数据库配置
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  prefix: string;
  // Redis 配置
  redisHost: string;
  redisPort: number;
  redisPassword: string;
}

// 多租户配置
export type TenantMode = 'auto' | 'manual' | 'none';

export interface TenantConfig {
  tenant_mode: TenantMode;
  enable_tenant: boolean;
  create_default_tenant: boolean;
  default_tenant_name: string;
  tenant_admin_username: string;
  tenant_admin_password: string;
  tenant_admin_email: string;
}

// 管理员配置
export interface AdminConfig {
  username: string;
  password: string;
  email: string;
  site_name: string;
  install_database: boolean;
  build_project: boolean;
  // 多租户配置（新增）
  enable_tenant: boolean;
  default_tenant_name: string;
  tenant_admin_username: string;
  tenant_admin_password: string;
  tenant_admin_email: string;
}
