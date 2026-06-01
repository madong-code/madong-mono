import type { TenantMemberRow } from './types';

import { requestClient } from '#/api/request';

import BaseService from '../../core/base';

/** 租户成员管理 API（按租户ID隔离） */
export const TenantMemberApi = (tenantId: number | string) => {
  const baseUrl = `/tenant/${tenantId}/member`;

  return {
    ...BaseService<TenantMemberRow>({
      baseUrl,
      allowedMethods: [],
      forbiddenMethods: [],
    }),
    /** 修改启用状态 */
    changStatus: (id: number, enabled: number): Promise<any> =>
      requestClient.put(`${baseUrl}/${id}/chang-status`, { enabled }),
    /** 锁定 */
    locked: (id: number): Promise<any> =>
      requestClient.put(`${baseUrl}/${id}/locked`),
    /** 解锁 */
    unLocked: (id: number): Promise<any> =>
      requestClient.put(`${baseUrl}/${id}/unLocked`),
    /** 重置密码 */
    resetPassword: (id: number): Promise<any> =>
      requestClient.put(`${baseUrl}/${id}/resetPassword`),
  };
};

/** 创建租户成员（不依赖 URL ID，通过请求体携带 tenant_id） */
export const createTenantMember = (data: Record<string, any>): Promise<any> =>
  requestClient.post('/tenant-member', data);

export type { TenantMemberRow };
