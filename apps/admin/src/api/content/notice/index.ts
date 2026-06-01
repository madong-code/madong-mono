import type { NoticeRow } from './types';

import BaseService from '#/api/core/base';
import { requestClient } from '#/api/request';

const baseUrl = '/content/notice';

export const NoticeService = {
  ...BaseService<NoticeRow>({ baseUrl }),

  publish(data: any) {
    return requestClient.post(`${baseUrl}/publish`, data);
  },
};
