import type {
  SaveTenantPluginAuthData,
  TenantPluginAuthListResult,
} from './types';

import { requestClient } from '#/api/request';

const baseUrl = '/plugin/tenant-auth';

export const AppPluginTenantAuthService = {
  getList(tenantId: string): Promise<TenantPluginAuthListResult> {
    return requestClient.get(baseUrl, {
      params: { tenant_id: tenantId },
    });
  },

  save(data: SaveTenantPluginAuthData): Promise<void> {
    return requestClient.post(baseUrl, data);
  },
};

export type * from './types';
