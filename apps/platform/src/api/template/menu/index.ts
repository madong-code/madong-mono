import BaseService from '#/api/core/base';
import { requestClient } from '#/api/request';

const baseUrl = '/template/menu';

export const MenuTemplateService = {
  ...BaseService({ baseUrl }),

  batchStore(data: Record<string, any>) {
    return requestClient.post(`${baseUrl}/batch-store`, data);
  },
};
