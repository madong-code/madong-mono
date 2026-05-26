import { requestClient } from '#/api/request';
import BaseService from '../../core/base';
import type { SubscriptionRow } from './types';

const baseUrl = '/subscription';

export const SubscriptionService = {
  ...BaseService<SubscriptionRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
  authorize: (id: number, permissionIds: string[]): Promise<any> =>
    requestClient.put(`/subscription/${id}/authorize`, { ids: permissionIds }),
  bindTenant: (id: number, tenantIds: string[]): Promise<any> =>
    requestClient.put(`/subscription/${id}/bind-tenant`, { ids: tenantIds }),
  getPermissionTree: (): Promise<any> =>
    requestClient.get('/subscription/permission/tree'),
};
