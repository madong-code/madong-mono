export interface ModuleRow {
  id: string | number
  name: string
  description: string
  detail_description: string
  category: string
  version: string
  update_time: string
  purchased: boolean
  installed: boolean
  is_new: boolean
  is_hot: boolean
  poster: string
  author?: string
  price?: number
  rating?: number
  download_count?: number
  created_at?: string
  updated_at?: string
}

export interface ModuleSearchParams {
  keyword?: string
  category?: string
  installed?: boolean
  purchased?: boolean
  is_new?: boolean
  is_hot?: boolean
  sort_by?: 'name' | 'update_time' | 'rating' | 'download_count'
  sort_order?: 'asc' | 'desc'
  current?: number
  size?: number
}

export interface ModuleDetailResponse extends ModuleRow {
  update_logs: ModuleUpdateLog[]
  dependencies?: string[]
  system_requirements?: string
  documentation_url?: string
  support_info?: string
}

export interface ModuleUpdateLog {
  version: string
  date: string
  content: string
  is_important?: boolean
}

export interface ModuleInstallParams {
  features_id: string | number
  config?: Record<string, any>
  overwrite?: boolean
}

export interface ModuleUninstallParams {
  name: string | number
  keep_data?: boolean
}

export interface ModuleOperationResponse {
  success: boolean
  message: string
  data?: any
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  current: number
  size: number
  total: number
  pages?: number
}

export type ModuleListResponse = PaginatedResponse<ModuleRow>

export interface ModuleUpgradeRecord {
  module_id: string | number
  module_code: string
  module_name: string
  version_list: ModuleVersion[]
}

export interface ModuleVersion {
  version_no: string
  release_time: string
  upgrade_log: string
  is_important: boolean
  size?: string
  compatibility?: string
  download_url?: string
}
