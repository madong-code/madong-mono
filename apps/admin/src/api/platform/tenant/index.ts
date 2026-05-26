import { requestClient } from '#/api/request';
import BaseService from '../../core/base';
import type { TenantRow } from './types';

const baseUrl = '/tenant'

export const TenantService = {
  ...BaseService<TenantRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
  bindPlan: (id: number, ids: number[]): Promise<any> =>
    requestClient.put(`/tenant/${id}/bind-plan`, { ids }),
  syncData: (id: number): Promise<any> =>
    requestClient.put(`/tenant/${id}/sync-data`),
};
