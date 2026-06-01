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

export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

export async function getTenantModeFlagApi() {
  return requestClient.get<AuthApi.TenantModeFlag>('/auth/tenant-mode');
}

export async function getTenantListApi() {
  return requestClient.get<AuthApi.TenantOption[]>('/auth/tenants');
}

export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}
