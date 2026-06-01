import type { RecycleBinRow } from './types';

import BaseService from '#/api/core/base';
import { requestClient } from '#/api/request';

const baseUrl = '/system/recycle';

export const RecycleBinService = {
  ...BaseService<RecycleBinRow>({ baseUrl }),

  restore(data: Record<string, any>) {
    return requestClient.put(baseUrl, data);
  },
};
