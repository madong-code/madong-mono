import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { MemberTag } from './types'

const baseUrl = '/member/tag'

export const MemberTagService = {
  ...BaseService<MemberTag>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),

  getTagMembers(tagId: number, params?: Record<string, any>): Promise<any> {
    return requestClient.get(`${baseUrl}/${tagId}/members`, { params })
  },

  batchAssignTags(data: Record<string, any>): Promise<any> {
    return requestClient.post(`${baseUrl}/batch-assign`, data)
  },

  getEnabledTags(): Promise<MemberTag[]> {
    return requestClient.get(`${baseUrl}/enabled`)
  },

  updateSort(data: Record<string, any>): Promise<any> {
    return requestClient.put(`${baseUrl}/update-sort`, data)
  },
}
