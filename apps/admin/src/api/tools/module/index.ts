import { requestClient } from '#/api/request'
import type {
  ModuleSearchParams,
  ModuleDetailResponse,
  ModuleInstallParams,
  ModuleUninstallParams,
  ModuleOperationResponse,
  ModuleUpgradeRecord,
  ModuleListResponse,
} from './types'

const baseUrl = '/plugin'

export const AppsService = {
  getModuleList(params: ModuleSearchParams): Promise<ModuleListResponse> {
    return requestClient.get(baseUrl, { params })
  },

  getModuleDetail(name: string | number): Promise<ModuleDetailResponse> {
    return requestClient.get(`${baseUrl}/detail/${name}`)
  },

  install(data: ModuleInstallParams): Promise<ModuleOperationResponse> {
    return requestClient.post(`${baseUrl}/install`, data)
  },

  uninstall(data: ModuleUninstallParams): Promise<ModuleOperationResponse> {
    return requestClient.post(`${baseUrl}/uninstall`, data)
  },

  download(data: any): Promise<ModuleOperationResponse> {
    return requestClient.post(`${baseUrl}/download`, data)
  },

  getModuleUpgradeLogs(name: string | number): Promise<ModuleUpgradeRecord> {
    return requestClient.get(`${baseUrl}/${name}/upgrade-logs`)
  },

  delete(name: string): Promise<ModuleOperationResponse> {
    return requestClient.delete(`${baseUrl}/${name}`)
  },

  checkEnvironment(params: any): Promise<ModuleOperationResponse> {
    return requestClient.get(`${baseUrl}/check-environment`, { params })
  },
}
