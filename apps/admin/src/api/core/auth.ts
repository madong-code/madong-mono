import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    user_name?: string;
    password?: string;
    mobile_phone?: string;
    code?: string;
    uuid?: string;
    type?: string;
    grant_type?: string;
    key_id?: string;
    tenant_id?: number | string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    client_id: string;
    expires_time: number;
    /** 登录/切换后当前租户信息 */
    tenant?: {
      code: string;
      database_mode: string;
      id: number | string;
      name: string;
    };
  }

  export interface RefreshTokenResult {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
  }

  /** 租户模式状态 */
  export interface TenantModeFlag {
    enabled: boolean;
    auto_select_first: boolean;
  }

  /** 租户选项 */
  export interface TenantOption {
    id: number | string;
    name: string;
    code: string;
    domain: string;
    database_mode: string;
    database_name: string;
    is_default?: boolean;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/login/login', data);
}

/**
 * 获取租户模式状态
 */
export async function getTenantModeFlagApi() {
  return requestClient.get<AuthApi.TenantModeFlag>('/login/tenant-mode');
}

/**
 * 获取租户列表（供登录选择）
 */
export async function getTenantListApi() {
  return requestClient.get<AuthApi.TenantOption[]>('/login/tenants');
}

/**
 * 获取当前登录用户的租户列表（已登录状态下的租户切换用）
 */
export async function getUserTenantListApi() {
  return requestClient.get<AuthApi.TenantOption[]>('/system/auth/tenant-list');
}

/**
 * 切换当前登录用户的租户
 */
export async function switchTenantApi(tenantId: number | string) {
  return requestClient.post<AuthApi.LoginResult>('/system/auth/switch-tenant', {
    tenant_id: tenantId,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(refreshToken: string) {
  return baseRequestClient.post('/system/auth/refresh-token', {
    refresh_token: refreshToken,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/login/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/system/auth/perm-code');
}
