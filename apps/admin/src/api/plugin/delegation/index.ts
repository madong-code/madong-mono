import { requestClient } from '#/api/request';

const baseUrl = '/plugin/auth-info';

export const ToolsAuthService = {
  getAuthInfo(params?: any) {
    return requestClient.get(`${baseUrl}/auth-info`, { params });
  },

  setAuthInfo(params: any) {
    return requestClient.post(`${baseUrl}/auth-info`, params);
  },

  getFrameworkVersion(params?: any) {
    return requestClient.get(`${baseUrl}/version`, { params });
  },
};
