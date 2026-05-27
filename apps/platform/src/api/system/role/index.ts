import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { RoleRow } from './types'

const baseUrl = '/system/role'

export const RoleService = {
  ...BaseService<RoleRow>({ baseUrl }),

  list(params?: Record<string, any>): Promise<RoleRow[] | { items: RoleRow[]; list?: any[] }> {
    return requestClient.get(baseUrl, { params })
  },
}
