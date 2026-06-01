import type { PluginDevelopRow } from './types';

import BaseService from '#/api/core/base';
import { requestClient } from '#/api/request';

const baseUrl = '/plugin/develop';

export const PluginDevelopService = {
  ...BaseService<PluginDevelopRow>({ baseUrl }),

  build(pluginKey: string) {
    return requestClient.post(`${baseUrl}/build`, { plugin_key: pluginKey });
  },

  update(id: number, data: Partial<PluginDevelopRow>) {
    return requestClient.put(`${baseUrl}/${id}`, data);
  },

  confirmImages(id: number, icon?: string, cover?: string) {
    return requestClient.post(`${baseUrl}/confirm-images/${id}`, {
      icon,
      cover,
    });
  },
};
