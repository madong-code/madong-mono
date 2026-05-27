import { requestClient } from '#/api/request';
import BaseService from '../../core/base';
import type { TenantRow } from './types';

const baseUrl = '/tenant/account'

export const TenantService = {
  ...BaseService<TenantRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
  bindPlan: (id: number, planId: number): Promise<any> =>
    requestClient.put(`/tenant/${id}/bind-plan`, { plan_id: planId }),
  syncData: (id: number): Promise<any> =>
    requestClient.put(`/tenant/${id}/sync-data`),
};
