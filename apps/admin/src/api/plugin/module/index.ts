import type {
  ModuleDetailResponse,
  ModuleInstallParams,
  ModuleListResponse,
  ModuleOperationResponse,
  ModuleSearchParams,
  ModuleUninstallParams,
  ModuleUpgradeRecord,
} from './types';

import { requestClient } from '#/api/request';

const baseUrl = '/plugin';

export const AppsService = {
  getModuleList(params: ModuleSearchParams): Promise<ModuleListResponse> {
    return requestClient.get(baseUrl, { params });
  },

  getModuleDetail(name: number | string): Promise<ModuleDetailResponse> {
    return requestClient.get(`${baseUrl}/detail/${name}`);
  },

  install(data: ModuleInstallParams): Promise<ModuleOperationResponse> {
    return requestClient.post(`${baseUrl}/install`, data);
  },

  uninstall(data: ModuleUninstallParams): Promise<ModuleOperationResponse> {
    return requestClient.post(`${baseUrl}/uninstall`, data);
  },

  download(data: any): Promise<ModuleOperationResponse> {
    return requestClient.post(`${baseUrl}/download`, data);
  },

  getModuleUpgradeLogs(name: number | string): Promise<ModuleUpgradeRecord> {
    return requestClient.get(`${baseUrl}/${name}/upgrade-logs`);
  },

  delete(name: string): Promise<ModuleOperationResponse> {
    return requestClient.delete(`${baseUrl}/${name}`);
  },

  checkEnvironment(params: any): Promise<ModuleOperationResponse> {
    return requestClient.get(`${baseUrl}/check-environment`, { params });
  },
};
