import type { TenantRow } from './types';

import { requestClient } from '#/api/request';

import BaseService from '../../core/base';

const baseUrl = '/tenant/account';

export const TenantService = {
  ...BaseService<TenantRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
  bindPlan: (id: number | string, planIds: string[]): Promise<any> =>
    requestClient.put(`/tenant/${id}/bind-plan`, { ids: planIds }),
  syncData: (id: number): Promise<any> =>
    requestClient.put(`/tenant/${id}/sync-data`, undefined, {
      timeout: 120_000,
    }),
};
