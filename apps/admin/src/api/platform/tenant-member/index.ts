import BaseService from '../../core/base';
import type { TenantMemberRow } from './types';

const baseUrl = '/admin-tenant'

export const AdminTenantService = {
  ...BaseService<TenantMemberRow>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
};
