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
  bindPlan: (id: string | number, planIds: string[]): Promise<any> =>
    requestClient.put(`/tenant/${id}/bind-plan`, { ids: planIds }),
  syncData: (id: number): Promise<any> =>
    requestClient.put(`/tenant/${id}/sync-data`),
};
