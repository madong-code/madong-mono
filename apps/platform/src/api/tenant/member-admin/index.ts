import { requestClient } from '#/api/request';
import BaseService from '../../core/base';
import type { TenantMemberRow } from './types';
import type { TenantMemberAdminRow } from './types';

const memberBaseUrl = '/tenant-member';
const memberAdminBaseUrl = '/tenant-member-admin';

/** 租户管理员用户 API */
export const TenantMemberApi = {
  ...BaseService<TenantMemberRow>({
    baseUrl: memberBaseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
  /** 修改启用状态 */
  changStatus: (id: number, enabled: number): Promise<any> =>
    requestClient.put(`${memberBaseUrl}/${id}/chang-status`, { enabled }),
  /** 锁定 */
  locked: (id: number): Promise<any> =>
    requestClient.put(`${memberBaseUrl}/${id}/locked`),
  /** 解锁 */
  unLocked: (id: number): Promise<any> =>
    requestClient.put(`${memberBaseUrl}/${id}/unLocked`),
  /** 重置密码 */
  resetPassword: (id: number): Promise<any> =>
    requestClient.put(`${memberBaseUrl}/${id}/resetPassword`),
};

/** 管理员-租户分配 API（per-admin 视角） */
export const TenantMemberAdminApi = {
  ...BaseService<TenantMemberAdminRow>({
    baseUrl: memberAdminBaseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
};

export type { TenantMemberRow, TenantMemberAdminRow };
