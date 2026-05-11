import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { RoleRow } from './types'

const baseUrl = '/system/role'

export const RoleService = {
  ...BaseService<RoleRow>({ baseUrl }),

  dataScope(id: number | string, data: Record<string, any>): Promise<RoleRow> {
    return requestClient.put(`${baseUrl}/${id}/data-scope`, data)
  },

  getScopeDeptTree(): Promise<any[]> {
    return requestClient.get(`${baseUrl}/scope/dept`)
  },
}
