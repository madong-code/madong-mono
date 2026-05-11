import BaseService from '#/api/core/base'
import { requestClient } from '#/api/request'
import type { ReviewRow } from './types'

const baseUrl = '/review'

export const ReviewService = {
  ...BaseService<ReviewRow>({ baseUrl }),

  approve(id: number, reason: string = '') {
    return requestClient.put(`/review/${id}/approve`, { reason })
  },

  reject(id: number, reason: string = '') {
    return requestClient.put(`/review/${id}/reject`, { reason })
  },

  batchApprove(ids: number[], reason: string = '') {
    return requestClient.post('/review/batch/approve', { ids, reason })
  },

  batchReject(ids: number[], reason: string = '') {
    return requestClient.post('/review/batch/reject', { ids, reason })
  },

  unapprove(id: number) {
    return requestClient.put(`/setting/review/${id}/unapprove`)
  },
}
