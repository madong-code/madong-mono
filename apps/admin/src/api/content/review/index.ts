import type { ReviewRow } from './types';

import BaseService from '#/api/core/base';
import { requestClient } from '#/api/request';

const baseUrl = '/content/review';

export const ReviewService = {
  ...BaseService<ReviewRow>({ baseUrl }),

  approve(id: number, reason: string = '') {
    return requestClient.put(`/content/review/${id}/approve`, { reason });
  },

  reject(id: number, reason: string = '') {
    return requestClient.put(`/content/review/${id}/reject`, { reason });
  },

  batchApprove(ids: number[], reason: string = '') {
    return requestClient.post('/content/review/batch/approve', { ids, reason });
  },

  batchReject(ids: number[], reason: string = '') {
    return requestClient.post('/content/review/batch/reject', { ids, reason });
  },

  unapprove(id: number) {
    return requestClient.put(`/setting/content/review/${id}/unapprove`);
  },
};
