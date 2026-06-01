import BaseService from '#/api/core/base';
import { requestClient } from '#/api/request';

const baseUrl = '/devtools/generator';

export const GeneratorCodeService = {
  ...BaseService<any>({ baseUrl }),

  getTableList(params?: any) {
    return requestClient.get(`${baseUrl}/table-list`, { params });
  },

  getPluginDevList() {
    return requestClient.get('/plugin/select');
  },

  getPreview(id: number | string) {
    return requestClient.get(`${baseUrl}/${id}/preview`);
  },

  download(id: number | string, params?: any) {
    return requestClient.get(`${baseUrl}/${id}/download`, {
      params,
      responseType: 'blob',
      timeout: 20_000,
    } as any);
  },

  deploy(id: number | string, params?: any) {
    return requestClient.put(`${baseUrl}/${id}/deploy`, params);
  },
};
