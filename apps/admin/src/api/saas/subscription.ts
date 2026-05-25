import { requestClient } from '#/api/request';
import BaseService from '../core/base';

const baseUrl = '/subscription';

export const SubscriptionService = {
  ...BaseService<any>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
  authorize: (id: string, data: any) => requestClient.put(`/subscription/${id}/authorize`, data),
  bindTenant: (id: string, tenantIds: number[]) => requestClient.put(`/subscription/${id}/bind-tenant`, { tenant_ids: tenantIds }),
};
